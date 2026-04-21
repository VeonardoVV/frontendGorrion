import { useEffect, useState } from "react";
import { supabase } from "../../../../app/services/apiSupabase";

// ─── Video Preview Component ──────────────────────────────────────────────────
const VideoPreview = ({ url, width = 360, height = 210, opacity = 1 }) => {
  const esTikTok = (u) => u?.includes("tiktok.com");
  const esYouTube = (u) => u?.includes("youtube.com") || u?.includes("youtu.be");
  const esFacebook = (u) => u?.includes("facebook.com") || u?.includes("fb.watch");

  const getEmbedTikTok = (u) => {
    const id = u.split("/video/")[1]?.split("?")[0];
    return `https://www.tiktok.com/embed/v2/${id}`;
  };
  const getEmbedYouTube = (u) => {
    let id = "";
    if (u.includes("youtu.be/")) id = u.split("youtu.be/")[1]?.split("?")[0];
    else if (u.includes("v=")) id = u.split("v=")[1]?.split("&")[0];
    else if (u.includes("/shorts/")) id = u.split("/shorts/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  };
  const getEmbedFacebook = (u) =>
    `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false&autoplay=false`;

  if (!url) return null;
  const iframeStyle = { borderRadius: "10px", border: "none", opacity, flexShrink: 0 };

  if (esTikTok(url))
    return <iframe src={getEmbedTikTok(url)} width="325" height="580" style={iframeStyle} allowFullScreen allow="autoplay" />;
  if (esYouTube(url))
    return <iframe src={getEmbedYouTube(url)} width={width} height={height} style={iframeStyle} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />;
  if (esFacebook(url))
    return <iframe src={getEmbedFacebook(url)} width={width} height={height} style={iframeStyle} allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" scrolling="no" />;

  return <video src={url} controls width={width} style={{ borderRadius: "10px", opacity, flexShrink: 0 }} />;
};

// ─── Modal Base ───────────────────────────────────────────────────────────────
const Modal = ({ visible, onClose, children, titulo }) => {
  if (!visible) return null;
  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.panel}>
        <div style={ms.header}>
          <span style={ms.titulo}>{titulo}</span>
          <button style={ms.xBtn} onClick={onClose}>✕</button>
        </div>
        <div style={ms.body}>{children}</div>
      </div>
    </div>
  );
};

// ─── Modal Añadir ─────────────────────────────────────────────────────────────
const ModalAnadir = ({ visible, onClose, onGuardado }) => {
  const [link, setLink] = useState("");
  const [mostrar, setMostrar] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const handleLinkChange = (e) => {
    setLink(e.target.value);
    setPreviewUrl("");
  };

  const handlePreview = () => {
    if (link.trim()) setPreviewUrl(link.trim());
  };

  const handleGuardar = async () => {
    if (!link.trim()) { setError("El link es obligatorio."); return; }
    setError("");
    setGuardando(true);
    const { error: err } = await supabase
      .from("testimonio")
      .insert([{ testlink: link.trim(), testmostrar: mostrar }]);
    setGuardando(false);
    if (err) { setError("Error al guardar: " + err.message); return; }
    setLink(""); setPreviewUrl(""); setMostrar(true);
    onGuardado();
    onClose();
  };

  const handleClose = () => {
    setLink(""); setPreviewUrl(""); setMostrar(true); setError("");
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} titulo="➕ Añadir testimonio">
      <label style={fm.label}>Link del video</label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
        <input
          style={fm.input}
          placeholder="https://www.youtube.com/watch?v=..."
          value={link}
          onChange={handleLinkChange}
          onKeyDown={(e) => e.key === "Enter" && handlePreview()}
        />
        <button style={fm.previewBtn} onClick={handlePreview} title="Previsualizar">
          👁
        </button>
      </div>

      {previewUrl && (
        <div style={fm.previewBox}>
          <p style={fm.previewLabel}>Vista previa</p>
          <VideoPreview url={previewUrl} width={340} height={200} />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "14px 0" }}>
        <label style={fm.label}>Mostrar en página</label>
        <div
          style={{ ...fm.toggle, background: mostrar ? "#6366f1" : "#d1d5db" }}
          onClick={() => setMostrar(!mostrar)}
        >
          <div style={{ ...fm.toggleBall, transform: mostrar ? "translateX(20px)" : "translateX(2px)" }} />
        </div>
        <span style={{ fontSize: "13px", color: mostrar ? "#6366f1" : "#9ca3af" }}>
          {mostrar ? "Activo" : "Inactivo"}
        </span>
      </div>

      {error && <p style={fm.error}>{error}</p>}

      <div style={fm.acciones}>
        <button style={fm.cancelBtn} onClick={handleClose}>Cancelar</button>
        <button style={fm.guardarBtn} onClick={handleGuardar} disabled={guardando}>
          {guardando ? "Guardando…" : "💾 Guardar"}
        </button>
      </div>
    </Modal>
  );
};

// ─── Modal Editar ─────────────────────────────────────────────────────────────
const ModalEditar = ({ visible, onClose, testimonio, onGuardado, onEliminado }) => {
  const [link, setLink] = useState("");
  const [mostrar, setMostrar] = useState(true);
  const [previewUrl, setPreviewUrl] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (testimonio) {
      setLink(testimonio.testlink || "");
      setMostrar(testimonio.testmostrar ?? true);
      setPreviewUrl(testimonio.testlink || "");
      setError("");
      setConfirmEliminar(false);
    }
  }, [testimonio]);

  const handleGuardar = async () => {
    if (!link.trim()) { setError("El link es obligatorio."); return; }
    setError("");
    setGuardando(true);
    const { error: err } = await supabase
      .from("testimonio")
      .update({ testlink: link.trim(), testmostrar: mostrar })
      .eq("testid", testimonio.testid);
    setGuardando(false);
    if (err) { setError("Error al actualizar: " + err.message); return; }
    onGuardado();
    onClose();
  };

  const handleEliminar = async () => {
    setEliminando(true);
    const { error: err } = await supabase
      .from("testimonio")
      .delete()
      .eq("testid", testimonio.testid);
    setEliminando(false);
    if (err) { setError("Error al eliminar: " + err.message); return; }
    onEliminado();
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} titulo="✏️ Editar testimonio">
      <label style={fm.label}>Link del video</label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
        <input
          style={fm.input}
          value={link}
          onChange={(e) => { setLink(e.target.value); setPreviewUrl(""); }}
          onKeyDown={(e) => e.key === "Enter" && setPreviewUrl(link.trim())}
        />
        <button style={fm.previewBtn} onClick={() => setPreviewUrl(link.trim())} title="Previsualizar">
          👁
        </button>
      </div>

      {previewUrl && (
        <div style={fm.previewBox}>
          <p style={fm.previewLabel}>Vista previa</p>
          <VideoPreview url={previewUrl} width={340} height={200} />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "14px 0" }}>
        <label style={fm.label}>Mostrar en página</label>
        <div
          style={{ ...fm.toggle, background: mostrar ? "#6366f1" : "#d1d5db" }}
          onClick={() => setMostrar(!mostrar)}
        >
          <div style={{ ...fm.toggleBall, transform: mostrar ? "translateX(20px)" : "translateX(2px)" }} />
        </div>
        <span style={{ fontSize: "13px", color: mostrar ? "#6366f1" : "#9ca3af" }}>
          {mostrar ? "Activo" : "Inactivo"}
        </span>
      </div>

      {error && <p style={fm.error}>{error}</p>}

      {confirmEliminar ? (
        <div style={fm.confirmBox}>
          <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#b91c1c" }}>
            ⚠️ ¿Seguro que quieres eliminar este testimonio?
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={fm.cancelBtn} onClick={() => setConfirmEliminar(false)}>No, cancelar</button>
            <button style={fm.eliminarConfirmBtn} onClick={handleEliminar} disabled={eliminando}>
              {eliminando ? "Eliminando…" : "Sí, eliminar"}
            </button>
          </div>
        </div>
      ) : (
        <div style={fm.acciones}>
          <button style={fm.eliminarBtn} onClick={() => setConfirmEliminar(true)}>🗑 Eliminar</button>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={fm.cancelBtn} onClick={onClose}>Cancelar</button>
            <button style={fm.guardarBtn} onClick={handleGuardar} disabled={guardando}>
              {guardando ? "Guardando…" : "💾 Guardar"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// ─── Tarjeta de Video ─────────────────────────────────────────────────────────
const TarjetaVideo = ({ item, onEditar }) => {
  const esTikTok = item.testlink?.includes("tiktok.com");
  return (
    <div style={cs.tarjeta}>
      <div style={{ opacity: item.testmostrar ? 1 : 0.5 }}>
        <VideoPreview url={item.testlink} width={esTikTok ? 280 : 320} height={esTikTok ? 500 : 200} />
      </div>
      <div style={cs.tarjetaFooter}>
        <span style={{ ...cs.badge, background: item.testmostrar ? "#dcfce7" : "#f3f4f6", color: item.testmostrar ? "#166534" : "#6b7280" }}>
          {item.testmostrar ? "● Activo" : "○ Inactivo"}
        </span>
        <button style={cs.editarBtn} onClick={() => onEditar(item)}>
          ✏️ Editar
        </button>
      </div>
    </div>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────
const Testimonios = () => {
  const [todos, setTodos] = useState([]);
  const [modalAnadir, setModalAnadir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState("todos"); // todos | activos | inactivos

  const obtener = async () => {
    const { data, error } = await supabase.from("testimonio").select("*").order("testid", { ascending: false });
    if (error) { console.error(error.message); return; }
    setTodos(data);
  };

  useEffect(() => { obtener(); }, []);

  const abrirEditar = (item) => { setSeleccionado(item); setModalEditar(true); };

  const lista = todos.filter((t) => {
    if (filtro === "activos") return t.testmostrar === true;
    if (filtro === "inactivos") return t.testmostrar === false;
    return true;
  });

  const activos = todos.filter((t) => t.testmostrar === true).length;
  const inactivos = todos.filter((t) => t.testmostrar === false).length;

  return (
    <div style={cs.container}>
      {/* Header */}
      <div style={cs.topBar}>
        <div>
          <h1 style={cs.titulo}>Testimonios</h1>
          <p style={cs.subtitulo}>
            <span style={{ color: "#6366f1", fontWeight: 600 }}>{activos} activos</span>
            {" · "}
            <span style={{ color: "#9ca3af" }}>{inactivos} inactivos</span>
          </p>
        </div>
        <button style={cs.addBtn} onClick={() => setModalAnadir(true)}>
          + Añadir
        </button>
      </div>

      {/* Filtros */}
      <div style={cs.filtros}>
        {[["todos", "Todos", todos.length], ["activos", "Activos", activos], ["inactivos", "Inactivos", inactivos]].map(([val, label, count]) => (
          <button
            key={val}
            style={{ ...cs.filtroBtn, ...(filtro === val ? cs.filtroBtnActivo : {}) }}
            onClick={() => setFiltro(val)}
          >
            {label}
            <span style={{ ...cs.filtroBadge, ...(filtro === val ? cs.filtroBadgeActivo : {}) }}>{count}</span>
          </button>
        ))}
      </div>

      {/* Grid de videos */}
      {lista.length === 0 ? (
        <div style={cs.vacio}>
          <p>No hay testimonios{filtro !== "todos" ? ` ${filtro}` : ""}.</p>
          <button style={cs.addBtnSmall} onClick={() => setModalAnadir(true)}>+ Añadir el primero</button>
        </div>
      ) : (
        <div style={cs.grid}>
          {lista.map((item) => (
            <TarjetaVideo key={item.testid} item={item} onEditar={abrirEditar} />
          ))}
        </div>
      )}

      {/* Modales */}
      <ModalAnadir
        visible={modalAnadir}
        onClose={() => setModalAnadir(false)}
        onGuardado={obtener}
      />
      <ModalEditar
        visible={modalEditar}
        onClose={() => setModalEditar(false)}
        testimonio={seleccionado}
        onGuardado={obtener}
        onEliminado={obtener}
      />
    </div>
  );
};

// ─── Estilos contenedor principal ─────────────────────────────────────────────
const cs = {
  container: { padding: "24px 28px", fontFamily: "'Segoe UI', sans-serif", maxWidth: "1200px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  titulo: { fontSize: "22px", fontWeight: "800", color: "#111", margin: 0 },
  subtitulo: { fontSize: "13px", color: "#6b7280", marginTop: "4px" },
  addBtn: {
    background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px",
    padding: "10px 20px", fontSize: "14px", fontWeight: "700", cursor: "pointer",
    boxShadow: "0 4px 12px rgba(99,102,241,0.35)", transition: "transform 0.1s",
  },
  addBtnSmall: {
    background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px",
    padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginTop: "8px",
  },
  filtros: { display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" },
  filtroBtn: {
    background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px",
    padding: "6px 14px", fontSize: "13px", fontWeight: "600", color: "#6b7280",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.15s",
  },
  filtroBtnActivo: { background: "#eef2ff", borderColor: "#a5b4fc", color: "#4f46e5" },
  filtroBadge: {
    background: "#e5e7eb", color: "#9ca3af", borderRadius: "99px",
    fontSize: "11px", padding: "1px 7px", fontWeight: "700",
  },
  filtroBadgeActivo: { background: "#c7d2fe", color: "#4f46e5" },
  grid: {
    display: "flex", flexWrap: "wrap", gap: "20px",
  },
  tarjeta: {
    background: "#fff", borderRadius: "14px", border: "1px solid #e5e7eb",
    overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex", flexDirection: "column",
  },
  tarjetaFooter: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 12px", borderTop: "1px solid #f3f4f6", gap: "8px",
  },
  badge: { fontSize: "12px", fontWeight: "600", borderRadius: "99px", padding: "3px 10px" },
  editarBtn: {
    background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px",
    padding: "5px 12px", fontSize: "12px", fontWeight: "600", color: "#374151",
    cursor: "pointer", transition: "background 0.15s",
  },
  vacio: {
    textAlign: "center", color: "#9ca3af", fontSize: "15px",
    padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center",
  },
};

// ─── Estilos modal ─────────────────────────────────────────────────────────────
const ms = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: "16px",
  },
  panel: {
    background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "480px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
    maxHeight: "90vh", display: "flex", flexDirection: "column",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px", borderBottom: "1px solid #f3f4f6",
  },
  titulo: { fontSize: "16px", fontWeight: "800", color: "#111" },
  xBtn: {
    background: "#f3f4f6", border: "none", borderRadius: "8px",
    width: "30px", height: "30px", cursor: "pointer", fontSize: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  body: { padding: "20px", overflowY: "auto" },
};

// ─── Estilos formulario ────────────────────────────────────────────────────────
const fm = {
  label: { fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" },
  input: {
    flex: 1, border: "1px solid #d1d5db", borderRadius: "8px",
    padding: "9px 12px", fontSize: "13px", color: "#111", outline: "none",
    transition: "border-color 0.15s", width: "100%",
  },
  previewBtn: {
    background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px",
    padding: "9px 13px", cursor: "pointer", fontSize: "16px", flexShrink: 0,
  },
  previewBox: {
    background: "#f9fafb", borderRadius: "10px", padding: "12px",
    marginBottom: "6px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
  },
  previewLabel: { fontSize: "12px", color: "#9ca3af", margin: 0, alignSelf: "flex-start" },
  toggle: {
    width: "44px", height: "24px", borderRadius: "99px", cursor: "pointer",
    position: "relative", transition: "background 0.2s", flexShrink: 0,
  },
  toggleBall: {
    position: "absolute", top: "3px", width: "18px", height: "18px",
    background: "#fff", borderRadius: "50%", transition: "transform 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
  error: { fontSize: "12px", color: "#dc2626", margin: "0 0 10px" },
  acciones: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", gap: "8px" },
  cancelBtn: {
    background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px",
    padding: "9px 16px", fontSize: "13px", fontWeight: "600", color: "#374151", cursor: "pointer",
  },
  guardarBtn: {
    background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px",
    padding: "9px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer",
  },
  eliminarBtn: {
    background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "8px",
    padding: "9px 14px", fontSize: "13px", fontWeight: "600", color: "#e11d48", cursor: "pointer",
  },
  eliminarConfirmBtn: {
    background: "#e11d48", color: "#fff", border: "none", borderRadius: "8px",
    padding: "9px 16px", fontSize: "13px", fontWeight: "700", cursor: "pointer",
  },
  confirmBox: {
    background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "10px",
    padding: "14px", marginTop: "8px",
  },
};

export default Testimonios;