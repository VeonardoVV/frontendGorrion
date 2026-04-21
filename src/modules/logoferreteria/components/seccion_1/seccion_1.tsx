import { useEffect, useState } from "react";
import { supabase } from "../../../../app/services/apiSupabase";
import style from "./seccion_1.module.css";

const Seccion_1 = () => {
  const [logos, setLogos] = useState([]); // [{ logoId, logoNombre, logoBucketnombre, url }]
  const [openModal, setOpenModal] = useState(false);
  const [openCrud, setOpenCrud] = useState(false);

  // --- estado subir ---
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState("");
  const [nombre, setNombre] = useState(""); // nombre sin extensión

  // --- estado editar ---
  const [logoSeleccionado, setLogoSeleccionado] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");

  // ─── obtener logos (bucket + BD) ───────────────────────────────────────────
  const obtenerLogos = async () => {
    const { data, error } = await supabase
      .from("logo")
      .select("*");

    if (error) {
      console.error("Error al obtener logos:", error.message);
      return;
    }

    const logosConUrl = data.map((logo) => {
      const { data: publicUrlData } = supabase.storage
        .from("LogoFerreteria")
        .getPublicUrl(logo.logobucketnombre);

      return {
        ...logo,
        url: publicUrlData.publicUrl,
      };
    });

    setLogos(logosConUrl);
  };

  useEffect(() => {
    obtenerLogos();
  }, []);

  // limpiar preview al desmontar
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ─── seleccionar archivo ────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArchivo(file);
    setPreview(URL.createObjectURL(file));

    // nombre sin extensión
    const sinExtension = file.name.replace(/\.[^/.]+$/, "");
    setNombre(sinExtension);
  };

  // ─── convertir a webp ───────────────────────────────────────────────────────
  const convertirAWebp = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.toBlob((blob) => resolve(blob), "image/webp", 0.8);
      };
    });
  };

  // ─── subir logo ─────────────────────────────────────────────────────────────
  const subirLogo = async () => {
    if (!archivo) {
      alert("Selecciona una imagen");
      return;
    }
    if (!nombre.trim()) {
      alert("Escribe un nombre para el logo");
      return;
    }

    const blobWebp = await convertirAWebp(archivo);
    const nombreBucket = `logo-${Date.now()}.webp`;
    const archivoFinal = new File([blobWebp], nombreBucket, { type: "image/webp" });

    const { error: uploadError } = await supabase.storage
      .from("LogoFerreteria")
      .upload(nombreBucket, archivoFinal);

    if (uploadError) {
      console.error("Error al subir:", uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from("logo").insert({
      logonombre: nombre.trim(),
      logobucketnombre: nombreBucket,
    });

    if (insertError) {
      console.error("Error al insertar en BD:", insertError.message);
      return;
    }

    // reset modal
    setOpenModal(false);
    setArchivo(null);
    setPreview("");
    setNombre("");
    obtenerLogos();
  };

  // ─── actualizar nombre ──────────────────────────────────────────────────────
  const actualizarLogo = async () => {
    if (!nuevoNombre.trim()) {
      alert("El nombre no puede estar vacío");
      return;
    }

    const { error } = await supabase
      .from("logo")
      .update({ logonombre: nuevoNombre.trim() })
      .eq("logoid", logoSeleccionado.logoid);

    if (error) {
      console.error("Error al actualizar:", error.message);
      return;
    }

    setOpenCrud(false);
    obtenerLogos();
  };

  // ─── eliminar logo ──────────────────────────────────────────────────────────
  const eliminarLogo = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este logo?")) return;

    // 1. eliminar del bucket
    const { error: storageError } = await supabase.storage
      .from("LogoFerreteria")
      .remove([logoSeleccionado.logobucketnombre]);

    if (storageError) {
      console.error("Error al eliminar del bucket:", storageError.message);
      return;
    }

    // 2. eliminar de la BD
    const { error: dbError } = await supabase
      .from("logo")
      .delete()
      .eq("logoid", logoSeleccionado.logoid);

    if (dbError) {
      console.error("Error al eliminar de BD:", dbError.message);
      return;
    }

    setOpenCrud(false);
    obtenerLogos();
  };

  // ─── abrir modal edición ────────────────────────────────────────────────────
  const abrirCrud = (logo) => {
    setLogoSeleccionado(logo);
    setNuevoNombre(logo.logonombre);
    setOpenCrud(true);
  };

  // ─── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>

      {/* BOTÓN agregar */}
      <svg
        viewBox="0 0 100 100"
        width="60"
        height="60"
        onClick={() => setOpenModal(true)}
        style={{ cursor: "pointer" }}
        title="Agregar logo"
      >
        <rect x="10" y="10" width="80" height="80" rx="12" fill="none" stroke="#333" strokeWidth="5" />
        <line x1="50" y1="28" x2="50" y2="72" stroke="#333" strokeWidth="5" strokeLinecap="round" />
        <line x1="28" y1="50" x2="72" y2="50" stroke="#333" strokeWidth="5" strokeLinecap="round" />
      </svg>

      {/* GRID de logos */}
      <h2 style={styles.titulo}>Logos</h2>

      <div style={styles.grid}>
        {logos.map((logo) => (
          <div
            key={logo.logoid}
            style={styles.logoCard}
            onClick={() => abrirCrud(logo)}
            title="Click para editar o eliminar"
          >
            <img src={logo.url} alt={logo.logonombre} style={styles.logoImg} />
            <p style={styles.logoNombre}>{logo.logonombre}</p>
          </div>
        ))}

        {logos.length === 0 && (
          <p style={{ color: "#888" }}>No hay logos aún. ¡Agrega uno!</p>
        )}
      </div>

      {/* ── MODAL SUBIR ── */}
      {openModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitulo}>Subir Logo</h3>

            {/* Botón de seleccionar imagen */}
            <label style={styles.fileLabel}>
              {archivo ? "Cambiar imagen" : "Seleccionar imagen"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>

            {/* Preview */}
            <div style={styles.previewBox}>
              {preview
                ? <img src={preview} alt="preview" style={styles.previewImg} />
                : <span style={styles.previewPlaceholder}>Vista previa</span>
              }
            </div>

            {/* Nombre sin extensión */}
            <label style={styles.label}>Nombre del logo</label>
            <input
              style={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Logo Principal"
            />

            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={subirLogo}>Guardar</button>
              <button style={styles.btnSecondary} onClick={() => {
                setOpenModal(false);
                setArchivo(null);
                setPreview("");
                setNombre("");
              }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR/ELIMINAR ── */}
      {openCrud && logoSeleccionado && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitulo}>Editar Logo</h3>

            <img src={logoSeleccionado.url} alt={logoSeleccionado.logonombre} style={styles.previewImg} />

            <label style={styles.label}>Nombre del logo</label>
            <input
              style={styles.input}
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />

            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={actualizarLogo}>Actualizar</button>
              <button style={styles.btnDanger} onClick={eliminarLogo}>Eliminar</button>
              <button style={styles.btnSecondary} onClick={() => setOpenCrud(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── estilos ─────────────────────────────────────────────────────────────────
const styles = {
  container: {
    padding: "20px",
    fontFamily: "sans-serif",
  },
  titulo: {
    margin: "16px 0 12px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
  logoCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    padding: "10px",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    transition: "box-shadow 0.2s",
  },
  logoImg: {
    width: "120px",
    height: "120px",
    objectFit: "contain",
  },
  logoNombre: {
    margin: 0,
    fontSize: "13px",
    color: "#333",
    textAlign: "center",
    maxWidth: "120px",
    wordBreak: "break-word",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    padding: "28px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "340px",
    maxWidth: "95vw",
  },
  modalTitulo: {
    margin: 0,
    fontSize: "18px",
  },
  fileLabel: {
    display: "inline-block",
    padding: "8px 16px",
    background: "#f0f0f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "center",
  },
  previewBox: {
    width: "100%",
    height: "160px",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  previewImg: {
    maxWidth: "100%",
    maxHeight: "160px",
    objectFit: "contain",
  },
  previewPlaceholder: {
    color: "#aaa",
    fontSize: "14px",
  },
  label: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "-6px",
  },
  input: {
    padding: "9px 12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  btnRow: {
    display: "flex",
    gap: "10px",
    marginTop: "4px",
  },
  btnPrimary: {
    flex: 1,
    padding: "9px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  btnSecondary: {
    flex: 1,
    padding: "9px",
    background: "#f0f0f0",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnDanger: {
    flex: 1,
    padding: "9px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Seccion_1;