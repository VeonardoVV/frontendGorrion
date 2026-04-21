import { useEffect, useRef, useState } from "react";
import styles from "./archivo.module.css";
import { supabase } from "../../../../app/services/apiSupabase";

type Producto = {
  prdcid: number;
  prdcimgnombre: string;
  prdcimgnombrebucket: string;
  prdcprecio: number;
  categoria: {
    ctgraid: number;
    ctgraimgnombre: string;
    ctgraimgnombrebucket: string;
  };
  marca: {
    marcaid: number;
    marcaimgnombre: string;
    marcaimgnombrebucket: string;
  };
};

type Props = {
  id: number;
  onCerrar: () => void;
  onGuardado: () => void;
};

type TipoImagen = "producto" | "categoria" | "marca";

// Convierte cualquier imagen a WebP usando canvas
const convertirAWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No se pudo obtener contexto canvas");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return reject("Error al convertir a WebP");
        const nombreSinExt = file.name.replace(/\.[^.]+$/, "");
        const webpFile = new File([blob], `${nombreSinExt}.webp`, { type: "image/webp" });
        URL.revokeObjectURL(url);
        resolve(webpFile);
      }, "image/webp", 0.9);
    };
    img.onerror = () => reject("Error al cargar imagen");
    img.src = url;
  });
};

const Archivo = ({ id, onCerrar, onGuardado }: Props) => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tipoActivoRef = useRef<TipoImagen | null>(null);
  const [filePendiente, setFilePendiente] = useState<{ file: File; tipo: TipoImagen } | null>(null);

  // Estados para edición de nombres
  const [editandoNombre, setEditandoNombre] = useState<TipoImagen | null>(null);
  const [nombreTemp, setNombreTemp] = useState("");

  useEffect(() => {
    obtenerProducto();
  }, [id]);

  const obtenerProducto = async () => {
    const { data, error } = await supabase
      .from("producto")
      .select(`
        *,
        categoria (ctgraid, ctgraimgnombre, ctgraimgnombrebucket),
        marca (marcaid, marcaimgnombre, marcaimgnombrebucket)
      `)
      .eq("prdcid", id)
      .single();
    if (error) console.log("Error:", error);
    else setProducto(data);
  };

  const handleImageClick = (tipo: TipoImagen) => {
    tipoActivoRef.current = tipo;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo || !tipoActivoRef.current) return;
    try {
      const webp = await convertirAWebP(archivo);
      setFilePendiente({ file: webp, tipo: tipoActivoRef.current });
    } catch (err) {
      console.log("Error convirtiendo imagen:", err);
    }
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!filePendiente || !producto) return;
    const { file, tipo } = filePendiente;
    const confirmar = window.confirm(`¿Seguro que quieres reemplazar la imagen de ${tipo}?`);
    if (!confirmar) return;

    const fileName = file.name;

    if (tipo === "producto") {
      if (producto.prdcimgnombrebucket) {
        await supabase.storage.from("imagenes").remove([`producto/${producto.prdcimgnombrebucket}`]);
      }
      const { error: upErr } = await supabase.storage.from("imagenes").upload(`producto/${fileName}`, file);
      if (upErr) { console.log(upErr); return; }
      const { error: dbErr } = await supabase.from("producto").update({ prdcimgnombrebucket: fileName }).eq("prdcid", producto.prdcid);
      if (dbErr) { console.log(dbErr); return; }
    }

    if (tipo === "categoria") {
      if (producto.categoria.ctgraimgnombrebucket) {
        await supabase.storage.from("imagenes").remove([`categoria/${producto.categoria.ctgraimgnombrebucket}`]);
      }
      const { error: upErr } = await supabase.storage.from("imagenes").upload(`categoria/${fileName}`, file);
      if (upErr) { console.log(upErr); return; }
      const { error: dbErr } = await supabase.from("categoria").update({ ctgraimgnombrebucket: fileName }).eq("ctgraid", producto.categoria.ctgraid);
      if (dbErr) { console.log(dbErr); return; }
    }

    if (tipo === "marca") {
      if (producto.marca.marcaimgnombrebucket) {
        await supabase.storage.from("imagenes").remove([`marca/${producto.marca.marcaimgnombrebucket}`]);
      }
      const { error: upErr } = await supabase.storage.from("imagenes").upload(`marca/${fileName}`, file);
      if (upErr) { console.log(upErr); return; }
      const { error: dbErr } = await supabase.from("marca").update({ marcaimgnombrebucket: fileName }).eq("marcaid", producto.marca.marcaid);
      if (dbErr) { console.log(dbErr); return; }
    }

    await obtenerProducto();
    setFilePendiente(null);
    tipoActivoRef.current = null;
    onGuardado();
  };

  // Iniciar edición de nombre
  const iniciarEdicionNombre = (tipo: TipoImagen) => {
    if (!producto) return;
    const valorActual =
      tipo === "producto" ? producto.prdcimgnombre :
      tipo === "categoria" ? producto.categoria.ctgraimgnombre :
      producto.marca.marcaimgnombre;
    setNombreTemp(valorActual);
    setEditandoNombre(tipo);
  };

  // Guardar nombre editado
  const guardarNombre = async (tipo: TipoImagen) => {
    if (!producto || !nombreTemp.trim()) return;

    if (tipo === "producto") {
      const { error } = await supabase.from("producto").update({ prdcimgnombre: nombreTemp.trim() }).eq("prdcid", producto.prdcid);
      if (error) { console.log(error); return; }
    }
    if (tipo === "categoria") {
      const { error } = await supabase.from("categoria").update({ ctgraimgnombre: nombreTemp.trim() }).eq("ctgraid", producto.categoria.ctgraid);
      if (error) { console.log(error); return; }
    }
    if (tipo === "marca") {
      const { error } = await supabase.from("marca").update({ marcaimgnombre: nombreTemp.trim() }).eq("marcaid", producto.marca.marcaid);
      if (error) { console.log(error); return; }
    }

    await obtenerProducto();
    setEditandoNombre(null);
    setNombreTemp("");
    onGuardado();
  };

  const cancelarEdicion = () => {
    setEditandoNombre(null);
    setNombreTemp("");
  };

  // Componente de tarjeta reutilizable
  const TarjetaImagen = ({
    tipo,
    nombre,
    bucketPath,
    carpeta,
  }: {
    tipo: TipoImagen;
    nombre: string;
    bucketPath: string;
    carpeta: string;
  }) => (
    <div className={styles.tarjeta}>
      {/* NOMBRE editable */}
      <div className={styles.nombreRow}>
        {editandoNombre === tipo ? (
          <>
            <input
              className={styles.inputNombre}
              value={nombreTemp}
              onChange={(e) => setNombreTemp(e.target.value)}
              autoFocus
            />
            <button className={styles.btnGuardar} onClick={() => guardarNombre(tipo)}>✓</button>
            <button className={styles.btnCancelar} onClick={cancelarEdicion}>✕</button>
          </>
        ) : (
          <>
            <span className={styles.nombreTexto}>{nombre}</span>
            <button className={styles.btnEditar} onClick={() => iniciarEdicionNombre(tipo)}>✏️</button>
          </>
        )}
      </div>

      {/* CAJA IMAGEN */}
      <div
        className={styles.cajaImagen}
        onClick={() => handleImageClick(tipo)}
        title="Click para cambiar imagen"
      >
        {bucketPath ? (
          <img
            src={`https://qeyuymprpmsqvukmdxfz.supabase.co/storage/v1/object/public/imagenes/${carpeta}/${encodeURIComponent(bucketPath)}`}
            className={styles.imagen}
            alt={nombre}
          />
        ) : (
          <span className={styles.sinImagen}>+ Subir imagen</span>
        )}
        <div className={styles.overlay2}>
          <span>{bucketPath ? "🔄 Reemplazar" : "⬆️ Subir"}</span>
        </div>
      </div>

      {/* BOTÓN CONFIRMAR si hay archivo pendiente para este tipo */}
      {filePendiente?.tipo === tipo && (
        <button className={styles.btnConfirmar} onClick={handleUpload}>
          ✅ Confirmar: {filePendiente.file.name}
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />

        <div className={styles.columnas}>
          {/* COLUMNA PRODUCTO */}
          {producto && (
            <TarjetaImagen
              tipo="producto"
              nombre={producto.prdcimgnombre}
              bucketPath={producto.prdcimgnombrebucket}
              carpeta="producto"
            />
          )}

          {/* COLUMNA CATEGORÍA */}
          {producto?.categoria && (
            <TarjetaImagen
              tipo="categoria"
              nombre={producto.categoria.ctgraimgnombre}
              bucketPath={producto.categoria.ctgraimgnombrebucket}
              carpeta="categoria"
            />
          )}

          {/* COLUMNA MARCA */}
          {producto?.marca && (
            <TarjetaImagen
              tipo="marca"
              nombre={producto.marca.marcaimgnombre}
              bucketPath={producto.marca.marcaimgnombrebucket}
              carpeta="marca"
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default Archivo;