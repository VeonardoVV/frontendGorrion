import styles from "./modal.module.css";
import { useState } from "react";
import { supabase } from "../../../../app/services/apiSupabase.ts";
import { convertirAWebp } from "../../../../core/utils/convertToWebp.ts";
type Props = {
  type: "producto" | "categoria" | "marca" | null; // solo se permite este estos 3 valores
  onClose: () => void;
};

type Producto = {
  prdcimgnombre: string;
  prdcimgnombrebucket: string;
  prdcprecio: number;
  ctgraid: number | null;
  marcaid: number | null;
};

type Categoria = {
  ctgraimgnombre: string;
  ctgraimgnombrebucket: string;
};

type Marca = {
  marcaimgnombre: string;
  marcaimgnombrebucket: string;
};


export default function Modal({ type, onClose }: Props) { // función principal


// almacena los datos en estas variables

const [producto, setProducto] = useState<Producto>({
  prdcimgnombre: "",
  prdcimgnombrebucket: "",
  prdcprecio: 0,
  ctgraid: null,
  marcaid: null
});

const [categoria, setCategoria] = useState<Categoria>({
  ctgraimgnombre: "",
  ctgraimgnombrebucket: ""
});

const [marca, setMarca] = useState<Marca>({
  marcaimgnombre: "",
  marcaimgnombrebucket: ""
});
//-------------------------------------------------------------------------------------------
//-----------------------------PRODUCTO------------------------------------------------------
//-------------------------------------------------------------------------------------------
const [previewProducto, setPreviewProducto] = useState<string | null>(null);  
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewProducto(url);
      setFileProducto(file); // 🔥 importante
    }
  };
  // -------------------------------------------------------------------------------------------------------
  const [imagenesCategoria, setImagenesCategoria] = useState<{
    id: number;
    nombre: string;
    url: string | null;
  }[]>([]);

  const [busquedaCategoria, setBusquedaCategoria] = useState(""); //esto es para el modal de marca , para que filtr las marcas cuando escriba en la caja 
  const [openModalCategoria, setOpenModalCategoria] = useState(false);
  const [previewCategoria, setPreviewCategoria] = useState<string | null>(null);

  const listarImgCategoria = async () => {
    const { data, error } = await supabase
      .from("categoria")
      .select("ctgraid, ctgraimgnombre, ctgraimgnombrebucket");

    if (error) {
      console.error(error);
      return;
    }

    const categorias = data.map((item) => {
      let url = null;

      if (item.ctgraimgnombrebucket) {
        const { data: urlData } = supabase.storage
          .from("imagenes")
          .getPublicUrl(`categoria/${item.ctgraimgnombrebucket}`);

        url = urlData.publicUrl;
      }

      return {
        id: item.ctgraid,
        nombre: item.ctgraimgnombre,
        url: url,
      };
    });

    setImagenesCategoria(categorias);
    setOpenModalCategoria(true);
  };
  // -------------------------------------------------------------------------------------------------------
  const [busquedaMarca, setBusquedaMarca] = useState(""); //esto es para el modal de marca , para que filtr las marcas cuando escriba en la caja 
  const [marcaId, setMarcaId] = useState<number | null>(null);
  const [imagenesMarca, setImagenesMarca] = useState<string[]>([]);
  const [openModalMarca, setOpenModalMarca] = useState(false);
  const [previewMarca, setPreviewMarca] = useState<string | null>(null);

  const listarImgMarca = async () => {
    const { data, error } = await supabase
      .storage
      .from("imagenes")
      .list("marca");

    if (error) {
      console.error(error);
      return;
    }

    const urls = data
      .filter(file => file.name !== ".emptyFolderPlaceholder") // 👈 IMPORTANTE
      .map((file) => {
        const { data: urlData } = supabase
          .storage
          .from("imagenes")
          .getPublicUrl(`marca/${file.name}`);

        return urlData.publicUrl;
      });

    setImagenesMarca(urls);
    setOpenModalMarca(true);
  };
// -------------------------------------------------Insertar Producto--------------------------------------------
const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [fileProducto, setFileProducto] = useState<File | null>(null);
  
const insertarProducto = async () => {

  // 🔴 VALIDACIONES
  if (!producto.prdcimgnombre || producto.prdcprecio <= 0) {
    alert("Completa nombre y precio");
    return;
  }

  if (!categoriaId) {
    alert("Selecciona una categoría");
    return;
  }

  if (!marcaId) {
    alert("Selecciona una marca");
    return;
  }

  if (!fileProducto) {
    alert("Sube una imagen");
    return;
  }

  // 🟡 VALIDAR SI YA EXISTE (AQUÍ VA 🔥)
const nombreLimpio = producto.prdcimgnombre.trim().toLowerCase();

const { data } = await supabase
  .from("producto")
  .select("prdcimgnombre")
  .ilike("prdcimgnombre", nombreLimpio);

  if (data && data.length > 0) {
    alert("Ese producto ya existe");
    return;
  }

  // 🔥 1. convertir a webp
  const fileWebp = await convertirAWebp(fileProducto);

  const fileName = `producto-${Date.now()}.webp`;

  // 🔹 2. subir imagen
  const { error: uploadError } = await supabase.storage
    .from("imagenes")
    .upload(`producto/${fileName}`, fileWebp);

  if (uploadError) {
    console.error(uploadError);
    return;
  }

  // 🔹 3. insertar en BD
  const { error } = await supabase
    .from("producto")
    .insert([
      {
        prdcimgnombre: producto.prdcimgnombre,
        prdcimgnombrebucket: fileName,
        prdcprecio: producto.prdcprecio,
        ctgraid: categoriaId,
        marcaid: marcaId
      }
    ]);

  if (error) {
    console.error(error);
  } else {
    console.log("Producto guardado 🔥");
    onClose();
  }
};
//-------------------------------------------------------------------------------------------
//-------------------------------------CATEGORIA---------------------------------------------
//-------------------------------------------------------------------------------------------

//-----------------------------Insertar en la tabla categoria--------------------------------
const [fileCategoria, setFileCategoria] = useState<File | null>(null);
const insertarCategoria = async () => {
  try {
    if (!categoria.ctgraimgnombre) {
      alert("Ingrese el nombre de la categoría");
      return;
    }

    let bucketName = "";  

    // 🔥 2. Si hay imagen → convertir a WebP y subir
    if (fileCategoria) {
      const webpFile = await convertirAWebp(fileCategoria);

      bucketName = `categoria_${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes")
        .upload(`categoria/${bucketName}`, webpFile, {
          contentType: "image/webp",
        });

      if (uploadError) {
        console.error(uploadError);
        alert("Error al subir imagen");
        return;
      }
    }

    // 🔥 3. Insertar en BD
    const { error } = await supabase
      .from("categoria")
      .insert([
        {
          ctgraimgnombre: categoria.ctgraimgnombre,
          ctgraimgnombrebucket: bucketName,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Error al insertar categoría");
      return;
    }

    alert("Categoría creada correctamente");

    // 🔥 limpiar estado
    setCategoria({
      ctgraimgnombre: "",
      ctgraimgnombrebucket: "",
    });

    setFileCategoria(null);
    setPreviewCategoria(null);

    onClose();
  } catch (err) {
    console.error(err);
    alert("Error inesperado");
  }
};
// mostrar imagen en la caja 
const handlePreviewCategoria = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const url = URL.createObjectURL(file);

  setPreviewCategoria(url);   // 👈 muestra imagen en pantalla
  setFileCategoria(file);     // 👈 guardas archivo para luego subirlo
};

//-------------------------------------------------------------------------------------------
//-------------------------------MARCA-------------------------------------------------------
//-------------------------------------------------------------------------------------------
//-----------------------------Insertar en la tabla categoria--------------------------------
const [fileMarca, setFileMarca] = useState<File | null>(null);
const insertarMarca = async () => {
  try {
    if (!marca.marcaimgnombre) {
      alert("Ingrese el nombre de la marca");
      return;
    }

    let bucketName = "";  

    // 🔥 2. Si hay imagen → convertir a WebP y subir
    if (fileMarca) {
      const webpFile = await convertirAWebp(fileMarca);

      bucketName = `marca_${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes")
        .upload(`marca/${bucketName}`, webpFile, {
          contentType: "image/webp",
        });

      if (uploadError) {
        console.error(uploadError);
        alert("Error al subir imagen");
        return;
      }
    }

    // 🔥 3. Insertar en BD
    const { error } = await supabase
      .from("marca")
      .insert([
        {
          marcaimgnombre: marca.marcaimgnombre,
          marcaimgnombrebucket: bucketName,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Error al insertar marca");
      return;
    }

    alert("Marca creada correctamente");

    // 🔥 limpiar estado
    setMarca({
      marcaimgnombre: "",
      marcaimgnombrebucket: "",
    });

    setFileMarca(null);
    setPreviewMarca(null);

    onClose();
  } catch (err) {
    console.error(err);
    alert("Error inesperado");
  }
};
// mostrar imagen en la caja 
const handlePreviewMarca = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const url = URL.createObjectURL(file);

  setPreviewMarca(url);   // 👈 muestra imagen en pantalla
  setFileMarca(file);     // 👈 guardas archivo para luego subirlo
};

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {type === "producto" && (
          <div className={styles.productoModal}>
          
          {/* IZQUIERDA */}
          <div className={styles.producto}>
            <h2><b>Insertar Nuevo Producto</b></h2>

            <p>Nombre del producto</p>
            <input
              type="text"
              onChange={(e) =>
                setProducto({ ...producto, prdcimgnombre: e.target.value })
              }
            />

            <label className={styles.btn}>
              Sube imagen
              <input type="file" hidden onChange={handleImage} />
            </label>

            <div className={styles.mostrarImagen}>
              {previewProducto ? <img src={previewProducto} /> : "Imagen previa"}
            </div>

            <p>PRECIO:</p>
            <input
              type="number"
              onChange={(e) =>
                setProducto({ ...producto, prdcprecio: Number(e.target.value) })
              }
            />
          </div>

          {/* DERECHA */}
          <div className={styles.CategoriaMarca}>
            <p>CATEGORIA:</p>
            <button 
              className={styles.btn}
              onClick={listarImgCategoria}
            >
              Listar categoria
            </button>
            <div className={styles.mostrarCajaCategoriaMarca}>
            {previewCategoria ? (
              <img src={previewCategoria} />
            ) : (
              "Imagen categoría"
            )}
          </div>

            <p>MARCA:</p>
              <button 
                className={styles.btn}
                onClick={listarImgMarca}
              >
                Listar marca
              </button>
              <div className={styles.mostrarCajaCategoriaMarca}>
              {previewMarca ? (
                <img src={previewMarca} />
              ) : (
                "Imagen marca"
              )}
            </div>
          </div>
          

        </div>
        )}
{/* -------------------------------------------------------------------------------------------------------------------------------- */}
        {type === "categoria" && (
          <div className={styles.TypeCategoria}>

            <h2><b>Insertar Nueva Categoria</b></h2>

              <p>Nombre de la categoria</p>
              <input
                type="text"
                value={categoria.ctgraimgnombre}
                onChange={(e) =>
                  setCategoria({
                    ...categoria,
                    ctgraimgnombre: e.target.value,
                  })
                }
              />

            <div className={styles.btn}>
              <label className={styles.subirImgCategoria}>
                Subir Imagen
                <input
                  id="fileCategoria"
                  type="file"
                  hidden
                  onChange={handlePreviewCategoria}
                />
              </label>
            </div>

            <div className={styles.mostrarCajaCategoriaMarca}>
              {previewCategoria ? (
                <img src={previewCategoria} />
              ) : (
                "Imagen previa"
              )}
            </div>

          </div>
        )}
{/* ------------------------------------------------------------------------------------------------- */}
       {type === "marca" && (
          <div className={styles.TypeCategoria}>

            <h2><b>Insertar Nueva Categoria</b></h2>

              <p>Nombre de la categoria</p>
              <input
                type="text"
                value={marca.marcaimgnombre}
                onChange={(e) =>
                  setMarca({
                    ...marca,
                    marcaimgnombre: e.target.value,
                  })
                }
              />

            <div className={styles.btn}>
              <label className={styles.subirImgCategoria}>
                Subir Imagen
                <input
                  id="fileMarca"
                  type="file"
                  hidden
                  onChange={handlePreviewMarca}
                />
              </label>
            </div>

            <div className={styles.mostrarCajaCategoriaMarca}>
              {previewMarca ? (
                <img src={previewMarca} />
              ) : (
                "Imagen previa"
              )}
            </div>

          </div>
        )}

        <button 
          className={styles.btn}
          onClick={
            type === "producto"
              ? insertarProducto
              : type === "categoria"
              ? insertarCategoria
              : type === "marca"
              ? insertarMarca
              : onClose
          }
        >

          {type === "marca" && "Agregar Marca"}
          {type === "categoria" && "Agregar Categoria"}
          {type === "producto" && "Agregar Producto"}
        </button>
        <button onClick={onClose} className={styles.Cerrar}>Cerrar</button>
      </div>
      {/* ------------------------------------------------------------------------------------- */}
      {openModalCategoria && (
        <div 
          className={styles.ProductoModaCategoriaOverlay}
          onClick={() => setOpenModalCategoria(false)}
        >
          <div 
            className={styles.ProductoModaCategoria}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Selecciona una categoría</h3>

            {/* 🔍 Buscador */}
            <input 
              type="text" 
              placeholder="Buscar categoría..."
              value={busquedaCategoria}
              onChange={(e) => setBusquedaCategoria(e.target.value)}
            />

            <div className={styles.gridCategoria}>
              {imagenesCategoria
                .filter(item =>
                  item.nombre
                    ?.toLowerCase()
                    .includes(busquedaCategoria.toLowerCase())
                )
                .map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setPreviewCategoria(item.url);
                      setCategoriaId(item.id);
                      setOpenModalCategoria(false);
                    }}
                  >
                    {item.url ? (
                      <img src={item.url} />
                    ) : (
                      <div className={styles.sinImagen}>
                        {item.nombre}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------------------------------- */}
      {openModalMarca && (
        <div 
          className={styles.ProductoModaCategoriaOverlay}
          onClick={() => setOpenModalMarca(false)}
        >
          <div 
            className={styles.ProductoModaCategoria}
            onClick={(e) => e.stopPropagation()}
          >
            <b><h2>Selecciona una marca</h2></b>
            <input 
              type="text" 
              placeholder="Buscar marca..."
              value={busquedaMarca}
              onChange={(e) => setBusquedaMarca(e.target.value)}
            />
            <div className={styles.gridCategoria}>
              {imagenesMarca.map((img, i) => (
                <img 
                  key={i} 
                  src={img}
                  onClick={() => {
                    setPreviewMarca(img);
                    setMarcaId(i); // ⚠️ por ahora usas index (mejor luego BD)
                    setOpenModalMarca(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 