import { useEffect, useState } from "react";
import styles from "./CrudModal.module.css";

import {
  Producto,
  obtenerProductoPorId,
  getImagenProducto,
  actualizarProductoPorId,
} from "../../../core/services/producto.service";

import {
  Categoria,
  obtenerCategoriaPorId,
  listarCategorias,
  getImagenCategoria,
  actualizarCategoriaPorId
} from "../../../core/services/categoria.service";

import {
  Marca,
  obtenerMarcaPorId,
  listarMarcas,
  getImagenMarca,
  actualizarMarcaPorId
} from "../../../core/services/marca.service";

type Props = {
  id?: number;
  type: "producto" | "categoria" | "marca";
  onClose: () => void;
};

const CrudModal: React.FC<Props> = ({ id, type, onClose }) => {
  // ── Modales internos ──────────────────────────────────────────
  const [openModalCategoria, setOpenModalCategoria] = useState(false);
  const [openModalMarca, setOpenModalMarca]         = useState(false);

  // ── Listas desplegables ───────────────────────────────────────
  const [imagenesCategoria, setImagenesCategoria] = useState<any[]>([]);
  const [imagenesMarca, setImagenesMarca]         = useState<any[]>([]);

  // ── Búsqueda ──────────────────────────────────────────────────
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [busquedaMarca, setBusquedaMarca]         = useState("");

  // ── Archivo de imagen nuevo (para subir) ──────────────────────
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);

  // ── Datos del producto ────────────────────────────────────────
  const [producto, setProducto] = useState<Producto>({
    prdcid: 0,
    prdcimgnombre: "",
    prdcimgnombrebucket: "",
    prdcprecio: 0,
    ctgraid: 0,
    marcaid: 0,
    categoria: null,
    marca: null,
  });
  
  const [categoria, setCategoria] = useState<Categoria>({
    ctgraid: 0,
    ctgraimgnombre: "",
    ctgraimgnombrebucket: ""
  });

  const [marca, setMarca] = useState<Marca>({
    marcaid: 0,
    marcaimgnombre: "",
    marcaimgnombrebucket: ""
  });

  const esEdicion = !!id;
  const [loading,   setLoading]   = useState(false);
  const [guardando, setGuardando] = useState(false);

  // ── Previews ──────────────────────────────────────────────────
  const [previewProducto,  setPreviewProducto]  = useState<string | null>(null);
  const [previewCategoria, setPreviewCategoria] = useState<string | null>(null);
  const [previewMarca,     setPreviewMarca]     = useState<string | null>(null);

  // ── Carga inicial ─────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      if (!id) return;
      setLoading(true);

      try {
        ////////////////////////
        /////// PRODUCTO ///////
        ////////////////////////
        if (type === "producto") {
          const data = await obtenerProductoPorId(id);

          if (data) {
            setProducto({
              prdcid: data.prdcid,
              prdcimgnombre: data.prdcimgnombre,
              prdcimgnombrebucket: data.prdcimgnombrebucket,
              prdcprecio: data.prdcprecio,
              ctgraid: data.ctgraid,
              marcaid: data.marcaid,
              categoria: data.categoria,
              marca: data.marca,
            });

            setPreviewProducto(getImagenProducto(data.prdcimgnombrebucket));
            setPreviewCategoria(
              getImagenCategoria(data.categoria?.ctgraimgnombrebucket ?? "")
            );
            setPreviewMarca(
              getImagenMarca(data.marca?.marcaimgnombrebucket ?? "")
            );
          }
          ////////////////////////
          ////// CATEGORIA ///////
          ////////////////////////
          } else if (type === "categoria") {
            const data = await obtenerCategoriaPorId(id);

            if (data) {
              setCategoria({
                ctgraid: data.ctgraid,
                ctgraimgnombre: data.ctgraimgnombre,
                ctgraimgnombrebucket: data.ctgraimgnombrebucket
              });

              setPreviewCategoria(getImagenCategoria(data.ctgraimgnombrebucket));

            }
          ////////////////////////
          //////// MARCA /////////
          ////////////////////////
          } else if (type === "marca") {
            const data = await obtenerMarcaPorId(id);

            if (data) {
              setMarca({
                marcaid: data.marcaid,
                marcaimgnombre: data.marcaimgnombre,
                marcaimgnombrebucket: data.marcaimgnombrebucket
              });

              setPreviewMarca(getImagenMarca(data.marcaimgnombrebucket));

            }
          }

        } catch (error) {
          console.error("Error al cargar:", error);
        } finally {
          setLoading(false);
      }
    };

    cargar();
  }, [id, type]);

  // ── Handlers en aqui muestrala imagen y sube al bucket  ─────────────────────────────────────────
const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  setArchivoImagen(file);

  if (type === "producto") {
    setPreviewProducto(url);
  } else if (type === "categoria") {
    setPreviewCategoria(url);
  } else if (type === "marca") {
    setPreviewMarca(url);
  }
};

  // /////////////////////////////////////////////////////////////////////////////////////////////
  // //////////////////////////   solo sirve para listar Categorias   ////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////
  const handleListarCategorias = async () => {
    // listarCategorias() no recibe parámetros según tu service
    const data = await listarCategorias();
    const mapped = data.map((c: any) => ({
      id:     c.ctgraid,
      nombre: c.ctgraimgnombre,
      url:    getImagenCategoria(c.ctgraimgnombrebucket),
    }));
    setImagenesCategoria(mapped);
    setOpenModalCategoria(true);
  };

  // /////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////   solo sirve para listar Marcas   ///////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////
  const handleListarMarcas = async () => {
    const data = await listarMarcas();
    const mapped = data.map((m) => ({
      id:     m.marcaid,
      nombre: m.marcaimgnombre,
      url:    getImagenMarca(m.marcaimgnombrebucket),
    }));
    setImagenesMarca(mapped);
    setOpenModalMarca(true);
  };


  // /////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////   actualiza Producto,Categoria y Marca   ////////////////////////////
  // /////////////////////////////////////////////////////////////////////////////////////////////
  const handleActualizar = async () => {
    if (!id) return;
    setGuardando(true);

    if (type === "producto") {
      const resultado = await actualizarProductoPorId(
        id,
        {
          prdcimgnombre: producto.prdcimgnombre,
          prdcprecio: producto.prdcprecio,
          ctgraid: producto.ctgraid,
          marcaid: producto.marcaid,
        },
        archivoImagen ?? undefined
      );

      if (resultado) {
        alert("Producto actualizado correctamente ✅");
        onClose();
      } else {
        alert("Error al actualizar el producto ❌");
      }

    } else if (type === "categoria") {
      const resultado = await actualizarCategoriaPorId(
        id,
        {
          ctgraimgnombre: categoria.ctgraimgnombre
        },
        archivoImagen ?? undefined
      );

      if (resultado) {
        alert("Categoria actualizado correctamente ✅");
        onClose();
      } else {
        alert("Error al actualizar la categoria ❌");
      }

    } else if (type === "marca") {
      const resultado = await actualizarMarcaPorId(
        id,
        {
          marcaimgnombre: marca.marcaimgnombre
        },
        archivoImagen ?? undefined
      );

      if (resultado) {
        alert("Marca actualizado correctamente ✅");
        onClose();
      } else {
        alert("Error al actualizar la Marca ❌");
      }
    }

    setGuardando(false);
  };

  // ── Render mientras que no carge ,  aparecera esto por el momento────────────────────────────────────────────────────
  if (loading) return <p>Cargando...</p>;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

{/* ///////////////////////////////////////////////////////////////////////////////// */}
{/* ////////////////////////////    PRODUCTO    ///////////////////////////////////// */}
{/* ///////////////////////////////////////////////////////////////////////////////// */}
        {type === "producto" && esEdicion && (
          <div>
            <div className={styles.productoModal}>
              
              <h2><b>Editar Producto</b></h2>

              {/* IZQUIERDA */}
              <div className={styles.producto}>
                <p>Nombre del producto</p>
                <input
                  type="text"
                  value={producto.prdcimgnombre ?? ""}
                  onChange={(e) => setProducto({ ...producto, prdcimgnombre: e.target.value })}/>

                <label className={styles.btn}>
                  Subir Imagen
                  <input type="file" hidden onChange={handleImage} />
                </label>

                <div className={styles.mostrarImagenProducto}>
                  {previewProducto ? (
                    <img src={previewProducto} alt="producto" />
                  ) : (
                    "Imagen previa"
                  )}
                </div>
                <p>PRECIO:</p>
                <input
                  type="number"
                  value={producto.prdcprecio}
                  onChange={(e) => setProducto({ ...producto, prdcprecio: Number(e.target.value) })}/>



              </div>

              {/* DERECHA */}
              <div className={styles.CategoriaMarca}>

                <p>CATEGORÍA:</p>
                {/* <input type="text" readOnly 
                  value={producto.prdcimgnombre ?? ""}
                  onChange={(e) => setProducto({ ...producto, prdcimgnombre: e.target.value })}/>
                 */}
                <button className={styles.btn} onClick={handleListarCategorias}>
                  Listar categoría
                </button>
                <div className={styles.mostrarCajaCategoriaMarca}>
                  {previewCategoria
                    ? <img src={previewCategoria} alt="categoría" />
                    : "Imagen categoría"}
                </div>

                <p>MARCA:</p>
                {/* <input type="text" readOnly/> */}
                <button className={styles.btn} onClick={handleListarMarcas}>
                  Listar marca
                </button>
                <div className={styles.mostrarCajaCategoriaMarca}>
                  {previewMarca
                    ? <img src={previewMarca} alt="marca" />
                    : "Imagen marca"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── AGREGAR PRODUCTO ── */}
        {type === "producto" && !esEdicion && (
          <h3>Momento de agregar un producto</h3>
        )}

{/* ///////////////////////////////////////////////////////////////////////////////// */}
{/* ////////////////////////////    CATEGORIA    //////////////////////////////////// */}
{/* ///////////////////////////////////////////////////////////////////////////////// */}
        {type === "categoria" && esEdicion && (
          <div>
            <div className={styles.categoriaModal}>

              {/* IZQUIERDA */}
              <div className={styles.categoria}>
                <h2><b>Editar Categoria</b></h2>

                <p>Nombre del categoria</p>
                <input
                  type="text"
                  value={categoria.ctgraimgnombre ?? ""}
                  onChange={(e) =>
                    setCategoria({ ...categoria, ctgraimgnombre: e.target.value })
                  }
                />

                <label className={styles.btn}>
                  Subir Imagen
                  <input type="file" hidden onChange={handleImage} />
                </label>

                <div className={styles.mostrarImagenCategoria}>
                  {previewCategoria ? (
                    <img src={previewCategoria} alt="categoria" />
                  ) : (
                    "Imagen previa"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── AGREGAR PRODUCTO ── */}
        {type === "categoria" && !esEdicion && (
          <h3>Momento de agregar una Categoria</h3>
        )}

{/* ///////////////////////////////////////////////////////////////////////////////// */}
{/* //////////////////////////////    MARCA    ////////////////////////////////////// */}
{/* ///////////////////////////////////////////////////////////////////////////////// */}
        {type === "marca" && esEdicion && (
          <div>
            <div className={styles.marcaModal}>

              {/* IZQUIERDA */}
              <div className={styles.marca}>
                <h2><b>Editar Marca</b></h2>

                <p>Nombre de la Marca</p>
                <input
                  type="text"
                  value={marca.marcaimgnombre ?? ""}
                  onChange={(e) =>
                    setMarca({ ...marca, marcaimgnombre: e.target.value })
                  }
                />

                <label className={styles.btn}>
                  Subir Imagen
                  <input type="file" hidden onChange={handleImage} />
                </label>

                <div className={styles.mostrarImagenMarca}>
                  {previewMarca ? (
                    <img src={previewMarca} alt="marca" />
                  ) : (
                    "Imagen previa"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── AGREGAR MARCA ── */}
        {type === "marca" && !esEdicion && (
          <h3>Momento de agregar una Marca</h3>
        )}

        {/* ── BOTONES PRINCIPALES ── */}
        <button className={styles.btn} onClick={onClose}>Cerrar</button>
        <button className={styles.btnActualizar} onClick={handleActualizar} disabled={guardando}>
          {guardando ? "Guardando..." : "Actualizar"}
        </button>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}></div>
      </div>

      // {/* //////////////////////////////////////////////////////////////////////////*/}
      // {/* ── MODAL CATEGORÍAS ── ///////////////////////////////////////////////////*/}
      // {/* //////////////////////////////////////////////////////////////////////////*/}
      
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

            <input
              type="text"
              placeholder="Buscar categoría..."
              value={busquedaCategoria}
              onChange={(e) => setBusquedaCategoria(e.target.value)}
            />

            <div className={styles.gridCategoria}>
              {imagenesCategoria
                .filter((item) =>
                  item.nombre?.toLowerCase().includes(busquedaCategoria.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setPreviewCategoria(item.url);
                      // ✅ guardamos el id real en el estado del producto
                      setProducto((prev) => ({ ...prev, ctgraid: item.id }));
                      setOpenModalCategoria(false);
                    }}
                  >
                    {item.url ? (
                      <img src={item.url} alt={item.nombre} />
                    ) : (
                      <div className={styles.sinImagen}>{item.nombre}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* //////////////////////////////////////////////////////////////////////////*/}
      {/* ── MODAL MARCAS ── ///////////////////////////////////////////////////////*/}
      {/* //////////////////////////////////////////////////////////////////////////*/}
      {openModalMarca && (
        <div
          className={styles.ProductoModaCategoriaOverlay}
          onClick={() => setOpenModalMarca(false)}
        >
          <div
            className={styles.ProductoModaCategoria}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Selecciona una marca</h3>

            <input
              type="text"
              placeholder="Buscar marca..."
              value={busquedaMarca}
              onChange={(e) => setBusquedaMarca(e.target.value)}
            />

            <div className={styles.gridCategoria}>
              {imagenesMarca
                .filter((item) =>
                  item.nombre?.toLowerCase().includes(busquedaMarca.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setPreviewMarca(item.url);
                      // ✅ guardamos el id real de la marca
                      setProducto((prev) => ({ ...prev, marcaid: item.id }));
                      setOpenModalMarca(false);
                    }}
                  >
                    {item.url ? (
                      <img src={item.url} alt={item.nombre} />
                    ) : (
                      <div className={styles.sinImagen}>{item.nombre}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudModal;