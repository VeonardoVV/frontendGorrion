import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Banner {
  bannerId: number;
  bannerNombre: string | null;
  bannerLink: string | null;
  bannerBucketNombre: string | null;
}

interface Seccion1Item {
  sc1Id: number;
  sc1UsarStorage: boolean;
  bannerId: number | null;
  banner: Banner | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const BUCKET = "BannerFerreteria";

function getPublicUrl(bucketNombre: string | null): string | null {
  if (!bucketNombre) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(bucketNombre);
  return data?.publicUrl ?? null;
}

async function convertToWebp(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context error"));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("Conversión a WebP fallida"));
        },
        "image/webp",
        0.9
      );
    };
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = url;
  });
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BannerCard({
  item,
  onEdit,
}: {
  item: Seccion1Item;
  onEdit: (item: Seccion1Item) => void;
}) {
  const banner = item.banner;
  const imageUrl = banner?.bannerBucketNombre
    ? getPublicUrl(banner.bannerBucketNombre)
    : banner?.bannerLink ?? null;

  const label = banner?.bannerNombre ?? banner?.bannerLink ?? "Sin nombre";

  return (
    <div className="banner-card" onClick={() => onEdit(item)}>
      <div className="banner-img-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="banner-img" />
        ) : (
          <div className="banner-no-img">
            <span>Sin imagen</span>
          </div>
        )}
        <div className="banner-overlay">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar
        </div>
      </div>
      <p className="banner-label" title={label}>{label}</p>
    </div>
  );
}

function SectionGroup({
  title,
  active,
  items,
  onEdit,
}: {
  title: string;
  active: boolean;
  items: Seccion1Item[];
  onEdit: (item: Seccion1Item) => void;
}) {
  return (
    <div className={`section-group ${active ? "group-active" : "group-inactive"}`}>
      <div className="group-header">
        <span className={`status-pill ${active ? "pill-active" : "pill-inactive"}`}>
          {active ? "✓ Activos" : "✗ Inactivos"}
        </span>
        <h2 className="group-title">{title}</h2>
        <span className="group-count">{items.length} banner{items.length !== 1 ? "s" : ""}</span>
      </div>
      {items.length === 0 ? (
        <p className="empty-state">No hay banners en esta sección.</p>
      ) : (
        <div className="banner-grid">
          {items.map((item) => (
            <BannerCard key={item.sc1Id} item={item} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalState {
  mode: "add" | "edit";
  item?: Seccion1Item;
}

function BannerModal({
  state,
  onClose,
  onSaved,
  existingBucketNames,
}: {
  state: ModalState;
  onClose: () => void;
  onSaved: () => void;
  existingBucketNames: string[];
}) {
  const isEdit = state.mode === "edit";
  const banner = state.item?.banner ?? null;
  const [usarStorage, setUsarStorage] = useState<boolean>(
    state.item?.sc1UsarStorage ?? true
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    isEdit && banner?.bannerBucketNombre
      ? getPublicUrl(banner.bannerBucketNombre)
      : isEdit && banner?.bannerLink
      ? banner.bannerLink
      : null
  );
  const [webpBlob, setWebpBlob] = useState<Blob | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [nombre, setNombre] = useState<string>(banner?.bannerNombre ?? "");
  const [link, setLink] = useState<string>(banner?.bannerLink ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const blob = await convertToWebp(file);
      setWebpBlob(blob);
      const base = stripExtension(file.name);
      setNewFileName(base);
      if (!nombre) setNombre(base);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch {
      setError("No se pudo procesar la imagen.");
    }
  }

  async function handleSave() {
    setError(null);
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    setLoading(true);
    try {
      let bucketNombre: string | null = banner?.bannerBucketNombre ?? null;

      // Upload new image if provided
      if (webpBlob && newFileName) {
        const filename = `${newFileName}.webp`;
        const nameNoExt = newFileName;

        // Check duplicate bucket names (exclude current)
        const isDuplicate = existingBucketNames
          .filter((n) => n !== (banner?.bannerBucketNombre ? stripExtension(banner.bannerBucketNombre) : null))
          .includes(nameNoExt);

        if (isDuplicate) {
          setError(`Ya existe un banner con el nombre de archivo "${nameNoExt}". Cambia el nombre.`);
          setLoading(false);
          return;
        }

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(filename, webpBlob, { upsert: false, contentType: "image/webp" });

        if (uploadError) {
          setError("Error al subir la imagen: " + uploadError.message);
          setLoading(false);
          return;
        }
        bucketNombre = filename;
      }

      if (isEdit && banner) {
        // 1. Actualizar banner
        const updates: Partial<Banner> = { bannerNombre: nombre.trim() };

        if (webpBlob) {
          updates.bannerBucketNombre = bucketNombre;
        }

        if (link.trim() !== "") updates.bannerLink = link.trim();

        const { error: upErr } = await supabase
          .from("banner")
          .update(updates)
          .eq("bannerId", banner.bannerId);

        if (upErr) throw upErr;

        // 🔥 2. ACTUALIZAR SECCION1 (AQUÍ ESTÁ LA CLAVE)
        const { error: sc1UpdateErr } = await supabase
          .from("seccion1")
          .update({
            sc1UsarStorage: usarStorage,
          })
          .eq("sc1Id", state.item?.sc1Id);

        if (sc1UpdateErr) throw sc1UpdateErr;
      }else {
        // Insert new banner then seccion1 row
        const { data: newBanner, error: insErr } = await supabase
          .from("banner")
          .insert({
            bannerNombre: nombre.trim(),
            bannerLink: link.trim() || null,
            bannerBucketNombre: bucketNombre,
          })
          .select()
          .single();

        if (insErr) throw insErr;

        const { error: sc1Err } = await supabase.from("seccion1").insert({
          sc1UsarStorage: !!bucketNombre,
          bannerId: newBanner.bannerId,
        });

        if (sc1Err) throw sc1Err;
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message ?? "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">{isEdit ? "Editar Banner" : "Añadir Banner"}</h2>

        {/* Image upload */}
        <div
          className="upload-zone"
          onClick={() => fileRef.current?.click()}
          style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : "none" }}
        >
          {!previewUrl && (
            <div className="upload-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Subir imagen</span>
              <small>Se convertirá automáticamente a WebP</small>
            </div>
          )}
          {previewUrl && <div className="upload-change-hint">Clic para cambiar</div>}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />

        {/* Nombre */}
        <div className="field">
          <label className="field-label">Nombre <span className="req">*</span></label>
          <input
            className="field-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del banner"
          />
        </div>
                  {/* Usar en página principal */}
        <div className="field">
          <label className="field-label">Mostrar en página principal</label>
          
          <select
            className="field-input"
            value={usarStorage ? "true" : "false"}
            onChange={(e) => setUsarStorage(e.target.value === "true")}
          >
            <option value="true">TRUE (Activo)</option>
            <option value="false">FALSE (Inactivo)</option>
          </select>
        </div>
        {/* Link (opcional) */}
        <div className="field">
          <label className="field-label">Link <span className="optional">(opcional)</span></label>
          <input
            className="field-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave} disabled={loading}>
            {loading ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Seccion1() {
  const [items, setItems] = useState<Seccion1Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState | null>(null);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase
      .from("seccion1")
      .select(`
        sc1Id,
        sc1UsarStorage,
        bannerId,
        banner (
          bannerId,
          bannerNombre,
          bannerLink,
          bannerBucketNombre
        )
      `);

    if (!error && data) {
      setItems(data as unknown as Seccion1Item[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const activeItems = items.filter((i) => i.sc1UsarStorage === true);
  const inactiveItems = items.filter((i) => i.sc1UsarStorage === false);

  const allBucketNames = items
    .map((i) => i.banner?.bannerBucketNombre ? stripExtension(i.banner.bannerBucketNombre) : null)
    .filter(Boolean) as string[];

  return (
    <>
      <style>{`
        /* ── Reset & base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .s1-root {
          font-family: 'Georgia', 'Times New Roman', serif;
          background: #0f0e0c;
          min-height: 100vh;
          color: #e8e0d0;
          padding: 2.5rem 2rem 4rem;
        }

        /* ── Header ── */
        .s1-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 3rem;
          border-bottom: 1px solid #2a2620;
          padding-bottom: 1.5rem;
        }
        .s1-header-text h1 {
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: .04em;
          color: #f0e8d8;
        }
        .s1-header-text p {
          font-size: .85rem;
          color: #6b6358;
          margin-top: .3rem;
          font-family: 'Courier New', monospace;
        }

        /* ── Add button ── */
        .btn-add {
          display: flex;
          align-items: center;
          gap: .5rem;
          background: #c8a04a;
          color: #0f0e0c;
          border: none;
          padding: .65rem 1.4rem;
          font-size: .85rem;
          font-family: 'Courier New', monospace;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background .2s, transform .15s;
        }
        .btn-add:hover { background: #dbb35a; transform: translateY(-1px); }

        /* ── Section Groups ── */
        .section-group { margin-bottom: 3.5rem; }

        .group-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .group-title {
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: .06em;
          color: #c8b89a;
          text-transform: uppercase;
        }
        .group-count {
          font-family: 'Courier New', monospace;
          font-size: .75rem;
          color: #4a4540;
          margin-left: auto;
        }

        .status-pill {
          font-family: 'Courier New', monospace;
          font-size: .7rem;
          font-weight: 700;
          padding: .2rem .7rem;
          letter-spacing: .1em;
        }
        .pill-active { background: #1a3a1a; color: #5aaa5a; border: 1px solid #2d6a2d; }
        .pill-inactive { background: #3a1a1a; color: #aa5a5a; border: 1px solid #6a2d2d; }

        .group-active { border-left: 3px solid #2d6a2d; padding-left: 1.2rem; }
        .group-inactive { border-left: 3px solid #6a2d2d; padding-left: 1.2rem; }

        /* ── Banner grid ── */
        .banner-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.2rem;
        }

        /* ── Banner card ── */
        .banner-card {
          cursor: pointer;
          position: relative;
        }
        .banner-img-wrap {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 */
          overflow: hidden;
          background: #1a1814;
        }
        .banner-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .35s ease, filter .35s ease;
        }
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: rgba(200,160,74,.85);
          color: #0f0e0c;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: .4rem;
          font-family: 'Courier New', monospace;
          font-size: .75rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity .25s;
        }
        .banner-card:hover .banner-overlay { opacity: 1; }
        .banner-card:hover .banner-img { filter: brightness(.55); transform: scale(1.04); }

        .banner-no-img {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3a3530;
          font-family: 'Courier New', monospace;
          font-size: .75rem;
          border: 1px dashed #2a2620;
        }

        .banner-label {
          font-size: .8rem;
          color: #8a8070;
          margin-top: .5rem;
          font-family: 'Courier New', monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 .1rem;
        }

        /* ── Empty state ── */
        .empty-state {
          color: #3a3530;
          font-family: 'Courier New', monospace;
          font-size: .8rem;
          padding: 1.5rem 0;
          font-style: italic;
        }

        /* ── Loading ── */
        .s1-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 40vh;
          color: #4a4540;
          font-family: 'Courier New', monospace;
          letter-spacing: .1em;
          font-size: .9rem;
        }
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid #2a2620;
          border-top-color: #c8a04a;
          border-radius: 50%;
          animation: spin .8s linear infinite;
          margin-right: .8rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.75);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal {
          background: #16140f;
          border: 1px solid #2a2620;
          width: 100%;
          max-width: 480px;
          padding: 2rem;
          position: relative;
          animation: modalIn .2s ease;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .modal-close {
          position: absolute;
          top: 1rem; right: 1rem;
          background: none;
          border: none;
          color: #6b6358;
          font-size: 1rem;
          cursor: pointer;
          line-height: 1;
          transition: color .2s;
        }
        .modal-close:hover { color: #e8e0d0; }

        .modal-title {
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: .06em;
          color: #c8b89a;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        /* Upload zone */
        .upload-zone {
          width: 100%;
          height: 160px;
          border: 1px dashed #3a3530;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          margin-bottom: 1.2rem;
          transition: border-color .2s;
        }
        .upload-zone:hover { border-color: #c8a04a; }
        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .4rem;
          color: #4a4540;
          font-family: 'Courier New', monospace;
        }
        .upload-placeholder span { font-size: .85rem; letter-spacing: .05em; }
        .upload-placeholder small { font-size: .7rem; color: #3a3530; }
        .upload-change-hint {
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          background: rgba(200,160,74,.85);
          color: #0f0e0c;
          font-family: 'Courier New', monospace;
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-align: center;
          padding: .35rem;
          text-transform: uppercase;
        }

        /* Fields */
        .field { margin-bottom: 1rem; }
        .field-label {
          display: block;
          font-family: 'Courier New', monospace;
          font-size: .72rem;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #6b6358;
          margin-bottom: .4rem;
        }
        .req { color: #c8a04a; }
        .optional { color: #3a3530; }
        .field-input {
          width: 100%;
          background: #0f0e0c;
          border: 1px solid #2a2620;
          color: #e8e0d0;
          padding: .6rem .8rem;
          font-family: 'Courier New', monospace;
          font-size: .85rem;
          outline: none;
          transition: border-color .2s;
        }
        .field-input:focus { border-color: #c8a04a; }
        .field-input::placeholder { color: #3a3530; }

        .modal-error {
          font-family: 'Courier New', monospace;
          font-size: .75rem;
          color: #aa5a5a;
          background: #2a1010;
          border: 1px solid #6a2d2d;
          padding: .5rem .8rem;
          margin-bottom: 1rem;
        }

        /* Modal actions */
        .modal-actions {
          display: flex;
          gap: .8rem;
          margin-top: 1.5rem;
          justify-content: flex-end;
        }
        .btn-cancel {
          background: none;
          border: 1px solid #2a2620;
          color: #6b6358;
          padding: .6rem 1.3rem;
          font-family: 'Courier New', monospace;
          font-size: .8rem;
          letter-spacing: .08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color .2s, color .2s;
        }
        .btn-cancel:hover { border-color: #6b6358; color: #e8e0d0; }
        .btn-cancel:disabled { opacity: .4; cursor: not-allowed; }

        .btn-save {
          background: #c8a04a;
          border: none;
          color: #0f0e0c;
          padding: .6rem 1.6rem;
          font-family: 'Courier New', monospace;
          font-size: .8rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background .2s;
        }
        .btn-save:hover { background: #dbb35a; }
        .btn-save:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>

      <div className="s1-root">
        {/* Header */}
        <div className="s1-header">
          <div className="s1-header-text">
            <h1>Banners</h1>
            <p>Gestión de imágenes · BannerFerreteria</p>
          </div>
          <button className="btn-add" onClick={() => setModal({ mode: "add" })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Añadir Banner
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="s1-loading">
            <div className="spinner" />
            Cargando banners…
          </div>
        ) : (
          <>
            <SectionGroup
              title="Banners Activos en Página Principal"
              active={true}
              items={activeItems}
              onEdit={(item) => setModal({ mode: "edit", item })}
            />
            <SectionGroup
              title="Banners Inactivos"
              active={false}
              items={inactiveItems}
              onEdit={(item) => setModal({ mode: "edit", item })}
            />
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <BannerModal
          state={modal}
          onClose={() => setModal(null)}
          onSaved={fetchData}
          existingBucketNames={allBucketNames}
        />

      )}
    </>
  );
}