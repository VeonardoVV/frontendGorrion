import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanel.module.css";
import img1 from "../../../../assets/img/baseDatos.png";
import * as XLSX from "xlsx";
import { supabase } from "../../../../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ExcelRow {
  descripcion: string;
  categoria: string;
  marca: string;
  precio: number | string;
}

interface ImportLog {
  type: "info" | "success" | "error" | "warn";
  msg: string;
}

type ImportStep = "idle" | "preview" | "importing" | "done";

// ─── Excel helpers ────────────────────────────────────────────────────────────

function normalizeKey(val: string): string {
  return val.toString().trim().toLowerCase();
}

function parseExcel(file: File): Promise<ExcelRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: "",
        }) as unknown[][];

        let headerRowIdx = -1;
        let colMap: Record<string, number> = {};

        for (let i = 0; i < raw.length; i++) {
          const row = raw[i].map((c) => normalizeKey(String(c)));
          const dIdx = row.indexOf("descripcion");
          const cIdx = row.indexOf("categoria");
          const mIdx = row.indexOf("marca");
          const pIdx = row.indexOf("precio");

          if (dIdx !== -1 && cIdx !== -1 && mIdx !== -1 && pIdx !== -1) {
            headerRowIdx = i;
            colMap = { descripcion: dIdx, categoria: cIdx, marca: mIdx, precio: pIdx };
            break;
          }
        }

        if (headerRowIdx === -1) {
          return reject(
            new Error("No se encontró una fila con DESCRIPCION, CATEGORIA, MARCA y PRECIO.")
          );
        }

        const rows: ExcelRow[] = [];
        for (let i = headerRowIdx + 1; i < raw.length; i++) {
          const r = raw[i];
          const desc = String(r[colMap.descripcion] ?? "").trim();
          const cat = String(r[colMap.categoria] ?? "").trim();
          const mar = String(r[colMap.marca] ?? "").trim();
          const prec = r[colMap.precio];
          if (!desc && !cat && !mar) continue;
          rows.push({ descripcion: desc, categoria: cat, marca: mar, precio: prec as number | string });
        }

        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Error al leer el archivo."));
    reader.readAsArrayBuffer(file);
  });
}

// ─── Import logic ─────────────────────────────────────────────────────────────

async function importRows(
  rows: ExcelRow[],
  onLog: (log: ImportLog) => void
): Promise<{ ok: number; skipped: number; failed: number }> {
  const categoriaCache: Record<string, number> = {};
  const marcaCache: Record<string, number> = {};

  const { data: existingCats } = await supabase.from("categoria").select("ctgraid, ctgraimgnombre");
  (existingCats ?? []).forEach((c: { ctgraid: number; ctgraimgnombre: string | null }) => {
    if (c.ctgraimgnombre) categoriaCache[c.ctgraimgnombre.toLowerCase()] = c.ctgraid;
  });

  const { data: existingMarks } = await supabase.from("marca").select("marcaid, marcaimgnombre");
  (existingMarks ?? []).forEach((m: { marcaid: number; marcaimgnombre: string | null }) => {
    if (m.marcaimgnombre) marcaCache[m.marcaimgnombre.toLowerCase()] = m.marcaid;
  });

  let ok = 0, skipped = 0, failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    try {
      const catKey = row.categoria.toLowerCase();
      let ctgraid: number;

      if (categoriaCache[catKey] !== undefined) {
        ctgraid = categoriaCache[catKey];
      } else {
        const { data: newCat, error: catErr } = await supabase
          .from("categoria")
          .insert({ ctgraimgnombre: row.categoria })
          .select("ctgraid")
          .single();
        if (catErr) throw new Error("Categoría: " + catErr.message);
        ctgraid = newCat.ctgraid;
        categoriaCache[catKey] = ctgraid;
        onLog({ type: "info", msg: `Nueva categoría creada: "${row.categoria}"` });
      }

      const markKey = row.marca.toLowerCase();
      let marcaid: number;

      if (marcaCache[markKey] !== undefined) {
        marcaid = marcaCache[markKey];
      } else {
        const { data: newMark, error: markErr } = await supabase
          .from("marca")
          .insert({ marcaimgnombre: row.marca })
          .select("marcaid")
          .single();
        if (markErr) throw new Error("Marca: " + markErr.message);
        marcaid = newMark.marcaid;
        marcaCache[markKey] = marcaid;
        onLog({ type: "info", msg: `Nueva marca creada: "${row.marca}"` });
      }

      const precio = parseFloat(String(row.precio).replace(",", "."));
      if (isNaN(precio)) throw new Error(`Precio inválido: "${row.precio}"`);

      const { data: existing, error: checkErr } = await supabase
        .from("producto")
        .select("prdcid")
        .eq("prdcimgnombre", row.descripcion)
        .eq("prdcprecio", precio)
        .eq("ctgraid", ctgraid)
        .eq("marcaid", marcaid)
        .maybeSingle();

      if (checkErr) throw new Error("Verificación duplicado: " + checkErr.message);

      if (existing) {
        skipped++;
        onLog({ type: "warn", msg: `[${rowNum}] ⚠ Omitido (ya existe): "${row.descripcion}" — S/ ${precio.toFixed(2)}` });
        continue;
      }

      const { error: prdcErr } = await supabase.from("producto").insert({
        prdcimgnombre: row.descripcion,
        prdcprecio: precio,
        ctgraid,
        marcaid,
      });

      if (prdcErr) throw new Error("Producto: " + prdcErr.message);

      ok++;
      onLog({ type: "success", msg: `[${rowNum}] ✓ "${row.descripcion}" — S/ ${precio.toFixed(2)}` });
    } catch (err: unknown) {
      failed++;
      onLog({ type: "error", msg: `[${rowNum}] ✗ "${row.descripcion}": ${(err as Error).message}` });
    }
  }

  return { ok, skipped, failed };
}

// ─── Import Modal ─────────────────────────────────────────────────────────────

function ImportModal({ onClose }: { onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<ImportStep>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [rows, setRows] = useState<ExcelRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [result, setResult] = useState<{ ok: number; skipped: number; failed: number } | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError(null);
    setFileName(file.name);
    try {
      const parsed = await parseExcel(file);
      setRows(parsed);
      setStep("preview");
    } catch (err: unknown) {
      setParseError((err as Error).message);
      setStep("idle");
    }
  }

  async function handleImport() {
    setStep("importing");
    setLogs([]);
    const addLog = (log: ImportLog) => setLogs((prev) => [...prev, log]);
    addLog({ type: "info", msg: `Iniciando importación de ${rows.length} registros…` });
    const res = await importRows(rows, addLog);
    setResult(res);
    addLog({
      type: res.failed === 0 ? "success" : "warn",
      msg: `─── Finalizado: ${res.ok} insertados · ${res.skipped} omitidos · ${res.failed} fallidos ───`,
    });
    setStep("done");
  }

  const logColors: Record<ImportLog["type"], string> = {
    info: "#7ab8e8",
    success: "#6de89a",
    error: "#e87a7a",
    warn: "#e8c87a",
  };

  return (
    <div style={bk.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={bk.modal}>
        {/* Header */}
        <div style={bk.modalHeader}>
          <div>
            <div style={bk.modalTitle}>Importar Excel</div>
            <div style={bk.modalSub}>productos · categorías · marcas</div>
          </div>
          <button style={bk.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ── IDLE / PREVIEW: upload zone ── */}
        {(step === "idle" || step === "preview") && (
          <>
            <div style={bk.uploadZone} onClick={() => fileRef.current?.click()}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <div style={bk.uploadLabel}>{fileName || "Seleccionar archivo .xlsx / .xls"}</div>
              <div style={bk.uploadHint}>
                Se buscará la fila con DESCRIPCION · CATEGORIA · MARCA · PRECIO
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "none" }}
              onChange={handleFile}
            />
            {parseError && <div style={bk.errorBox}>⚠ {parseError}</div>}
          </>
        )}

        {/* ── PREVIEW ── */}
        {step === "preview" && rows.length > 0 && (
          <>
            <div style={bk.previewHeader}>
              <span style={bk.previewBadge}>{rows.length} registros detectados</span>
              <span style={bk.previewFileName}>{fileName}</span>
            </div>
            <div style={bk.tableWrap}>
              <table style={bk.table}>
                <thead>
                  <tr>
                    {["#", "Descripción", "Categoría", "Marca", "Precio"].map((h) => (
                      <th key={h} style={bk.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 8).map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#1a1e2a" : "#161a24" }}>
                      <td style={bk.tdN}>{i + 1}</td>
                      <td style={bk.td}>{r.descripcion || <em style={{ color: "#555" }}>vacío</em>}</td>
                      <td style={bk.td}>{r.categoria}</td>
                      <td style={bk.td}>{r.marca}</td>
                      <td style={{ ...bk.td, textAlign: "right" as const }}>{r.precio}</td>
                    </tr>
                  ))}
                  {rows.length > 8 && (
                    <tr>
                      <td colSpan={5} style={{ ...bk.td, color: "#555", textAlign: "center" as const, fontStyle: "italic" }}>
                        … y {rows.length - 8} más
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={bk.actions}>
              <button
                style={bk.btnSecondary}
                onClick={() => { setStep("idle"); setRows([]); setFileName(""); }}
              >
                Cambiar archivo
              </button>
              <button style={bk.btnPrimary} onClick={handleImport}>
                Importar {rows.length} registros →
              </button>
            </div>
          </>
        )}

        {/* ── IMPORTING / DONE ── */}
        {(step === "importing" || step === "done") && (
          <>
            <div style={bk.logBox}>
              {logs.map((l, i) => (
                <div key={i} style={{ ...bk.logLine, color: logColors[l.type] }}>
                  {l.msg}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {step === "importing" && (
              <div style={bk.progressRow}>
                <div style={bk.spinner} />
                <span style={{ color: "#7ab8e8", fontSize: 13 }}>Procesando…</span>
              </div>
            )}

            {step === "done" && result && (
              <div style={bk.resultRow}>
                <span style={{ color: "#6de89a" }}>✓ {result.ok} insertados</span>
                {result.skipped > 0 && <span style={{ color: "#e8c87a" }}>⚠ {result.skipped} omitidos</span>}
                {result.failed > 0 && <span style={{ color: "#e87a7a" }}>✗ {result.failed} fallidos</span>}
                <button style={{ ...bk.btnPrimary, marginLeft: "auto" }} onClick={onClose}>
                  Cerrar
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Inline styles solo para el modal oscuro ─────────────────────────────────
const bk = {
  backdrop: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,.72)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "1rem",
  },
  modal: {
    background: "#12151f",
    border: "1px solid #2a2f45",
    borderRadius: 4,
    width: "100%",
    maxWidth: 620,
    padding: "1.6rem",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.1rem",
    fontFamily: "'Courier New', monospace",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  modalTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#e8eaf0", letterSpacing: ".08em", textTransform: "uppercase" as const },
  modalSub: { fontSize: ".7rem", color: "#4a5070", letterSpacing: ".1em", marginTop: 2 },
  closeBtn: { background: "none", border: "none", color: "#4a5070", fontSize: "1rem", cursor: "pointer", lineHeight: 1 },
  uploadZone: { border: "1px dashed #2a3050", borderRadius: 4, padding: "2rem 1rem", textAlign: "center" as const, cursor: "pointer", background: "#0e1118" },
  uploadLabel: { color: "#8090b0", fontSize: ".85rem", letterSpacing: ".05em" },
  uploadHint: { color: "#3a4060", fontSize: ".7rem", marginTop: 6, letterSpacing: ".06em" },
  errorBox: { background: "#2a1010", border: "1px solid #6a2d2d", color: "#e87a7a", padding: ".6rem .9rem", fontSize: ".78rem", borderRadius: 2 },
  previewHeader: { display: "flex", alignItems: "center", gap: ".8rem" },
  previewBadge: { background: "#1a2a4a", color: "#7ab8e8", padding: ".2rem .7rem", fontSize: ".72rem", letterSpacing: ".08em", border: "1px solid #2a4a7a", borderRadius: 2 },
  previewFileName: { color: "#4a5070", fontSize: ".75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  tableWrap: { overflowX: "auto" as const, border: "1px solid #1e2438", borderRadius: 2 },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: ".75rem" },
  th: { background: "#1a1e2e", color: "#5a6a9a", padding: ".45rem .7rem", textAlign: "left" as const, letterSpacing: ".08em", textTransform: "uppercase" as const, fontWeight: 700, whiteSpace: "nowrap" as const, borderBottom: "1px solid #2a2f45" },
  td: { padding: ".4rem .7rem", color: "#a0aac0", borderBottom: "1px solid #1a1e2e", whiteSpace: "nowrap" as const, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" },
  tdN: { padding: ".4rem .5rem", color: "#3a4060", borderBottom: "1px solid #1a1e2e", textAlign: "center" as const, minWidth: 28 },
  actions: { display: "flex", gap: ".7rem", justifyContent: "flex-end" },
  btnPrimary: { background: "#2563eb", border: "none", color: "#fff", padding: ".55rem 1.3rem", fontSize: ".78rem", fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: 2 },
  btnSecondary: { background: "none", border: "1px solid #2a2f45", color: "#5a6a9a", padding: ".55rem 1.1rem", fontSize: ".78rem", fontFamily: "'Courier New', monospace", letterSpacing: ".08em", textTransform: "uppercase" as const, cursor: "pointer", borderRadius: 2 },
  logBox: { background: "#080a10", border: "1px solid #1a1e2e", borderRadius: 2, padding: ".7rem .9rem", maxHeight: 240, overflowY: "auto" as const, display: "flex", flexDirection: "column" as const, gap: 3 },
  logLine: { fontSize: ".72rem", letterSpacing: ".03em", lineHeight: 1.5 },
  progressRow: { display: "flex", alignItems: "center", gap: ".6rem" },
  spinner: { width: 16, height: 16, border: "2px solid #2a2f45", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin .7s linear infinite" },
  resultRow: { display: "flex", alignItems: "center", gap: "1.2rem", fontSize: ".82rem", fontWeight: 700, letterSpacing: ".05em" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarImport, setMostrarImport] = useState(false);
  const [activo, setActivo] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");

  const botones = [
    { label: "Gestor de Tablas", path: "/home" },
  ];

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <div className={styles.adminPanel}>
        {/* ── Fila: botones nav + BD + editar ── */}
        <div className={styles.botones_y_BD}>

          {/* Botones de navegación */}
          <div className={styles.botonesNav}>
            {botones.map((b) => (
              <button
                key={b.path}
                onClick={() =>
                  navigate(b.path + (activo ? "?sinImagen=true" : ""))
                }
                className={location.pathname === b.path ? styles.activo : ""}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Base de Datos */}
          <div className={styles.botonBaseDatos}>
            <button onClick={() => setMostrarModal(true)}>
              <img src={img1} alt="base de datos" />
              Base de Datos
            </button>

            {mostrarModal && (
              <div
                className={styles.modalFondo}
                onClick={() => setMostrarModal(false)}
              >
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setMostrarModal(false);
                      setMostrarImport(true);
                    }}
                  >
                    Importar Excel
                  </button>
                  <button>Exportar Excel</button>
                </div>
              </div>
            )}
          </div>

          {/* Editar Página */}
          <button onClick={() => navigate("/ferreteria")}>
            Editar Página
          </button>
        </div>

        {/* ── Fila: toggle + búsqueda ── */}
        <div className={styles.toggle_cajaBusqueda}>
          {/* Toggle */}
          <div
            onClick={() => {
              const nuevoEstado = !activo;
              setActivo(nuevoEstado);

              navigate("/home" + (nuevoEstado ? "?sinImagen=true" : ""));
            }}
            style={{
              width: "52px",
              height: "24px",
              background: activo ? "#4ade80" : "#9DABB8",
              borderRadius: "30px",
              position: "relative",
              cursor: "pointer",
              transition: "background 0.3s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                background: "white",
                borderRadius: "50%",
                position: "absolute",
                top: "3px",
                left: activo ? "31px" : "3px",
                transition: "left 0.3s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </div>

          <p>Mostrar productos sin imágenes</p>

          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar..."
            className={styles.search_input}
            value={busqueda}
            onChange={(e) => {
              const valor = e.target.value;
              setBusqueda(valor);

              navigate(
                "/home?" +
                  (activo ? "sinImagen=true&" : "") +
                  (valor ? `buscar=${encodeURIComponent(valor)}` : "")
              );
            }}
          />
        </div>
      </div>

      {/* Import Modal */}
      {mostrarImport && (
        <ImportModal onClose={() => setMostrarImport(false)} />
      )}
    </>
  );
}