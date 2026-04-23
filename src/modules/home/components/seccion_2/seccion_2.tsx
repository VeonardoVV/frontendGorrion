import { useEffect, useState } from "react";
import styles from "./seccion_2.module.css";
import Modal from "../../../../shared/components/Modal/Modal";
import CrudModal from "../../../../shared/components/Modal/CrudModal";

import {
  Producto, getImagenProducto, eliminarProductoPorId, 
  listarProductoPaginacion

} from "../../../../core/services/producto.service";

import {
  Categoria,
  listarCategoriasPaginacion,eliminarCategoriaPorId,
  getImagenCategoria
} from "../../../../core/services/categoria.service";

import {
  Marca,
  listarMarcasPaginacion,eliminarMarcaPorId,
  getImagenMarca
} from "../../../../core/services/marca.service";



const Seccion_2 = () => {
  const [vista, setVista] = useState<"producto" | "categoria" | "marca">("producto");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const [pagina, setPagina] = useState(1);
  const LIMITE = 500;

  //se obtendra el id del registro y se edistara o eliminara
  // le mandamos el id pero ahora el CrudModal.tsx sabra si el id es de producto , categoria o marca 
  const [idEditando, setIdEditando] = useState<{
    id: number;
    type: "producto" | "categoria" | "marca";
  } | null>(null);
  
  // --- aquies donde se recibe el id del registro y despues se elimina con todo imagen ese registro 
  const handleEliminarProducto = async (id: number) => {
    const confirmacion = window.confirm(
      "⚠️ ¿Seguro que deseas eliminar este producto?\n\nEsta acción es IRREVERSIBLE."
    );

    if (!confirmacion) return;

    const ok = await eliminarProductoPorId(id);

    if (ok) {
      setProductos(prev => prev.filter(p => p.prdcid !== id));
    }
  };

  // --- aquies donde se recibe el id del registro y despues se elimina con todo imagen ese registro  de la categoria
  const handleEliminarCategoria = async (id: number) => {
    const confirmacion = window.confirm(
      "⚠️ ¿Seguro que deseas eliminar este Categoria?\n\nEsta acción es IRREVERSIBLE."
    );

    if (!confirmacion) return;

    const ok = await eliminarCategoriaPorId(id);

    if (ok) {
      setProductos(prev => prev.filter(p => p.ctgraid !== id));
    }
  };

  // --- aquies donde se recibe el id del registro y despues se elimina con todo imagen ese registro  de la categoria
  const handleEliminarMarca = async (id: number) => {
    const confirmacion = window.confirm(
      "⚠️ ¿Seguro que deseas eliminar esta Marca?\n\nEsta acción es IRREVERSIBLE."
    );

    if (!confirmacion) return;

    const ok = await eliminarMarcaPorId(id);

    if (ok) {
      setProductos(prev => prev.filter(p => p.marcaid !== id));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (vista === "producto") {
        const data = await listarProductoPaginacion(pagina, LIMITE);
        setProductos(data);
      }

      if (vista === "categoria") {
        const data = await listarCategoriasPaginacion(pagina, LIMITE);
        setCategorias(data);
      }

      if (vista === "marca") {
        const data = await listarMarcasPaginacion(pagina, LIMITE);
        setMarcas(data);
      }
    };

    loadData();
  }, [vista, pagina]);

return (
  <div className={styles.seccion}>
    {/* TOOLBAR */}
    <div className={styles.toolbar}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${vista === "producto" ? styles.active : ""}`}
          onClick={() => {
            setVista("producto");
            setPagina(1);
          }}
        >
          Producto
        </button>

        <button
          className={`${styles.tab} ${vista === "categoria" ? styles.active : ""}`}
          onClick={() => {
            setVista("categoria");
            setPagina(1);
          }}
        >
          Categoría
        </button>

        <button
          className={`${styles.tab} ${vista === "marca" ? styles.active : ""}`}
          onClick={() => {
            setVista("marca");
            setPagina(1);
          }}
        >
          Marca
        </button>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          className={styles.search}
          placeholder="🔍 Buscar..."
        />

        <label className={styles.checkbox}>
          <input type="checkbox" />
          <span>Sin imágenes</span>
        </label>
      </div>
    </div>

    {/* MODAL */}
    {idEditando !== null && (
      <Modal onClose={() => setIdEditando(null)}>
        <CrudModal
          id={idEditando.id}
          type={idEditando.type}
          onClose={() => setIdEditando(null)}
        />
      </Modal>
    )}

    {/* PAGINACIÓN */}
    <div style={{ marginTop: "20px" }}>
      <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
        Anterior
      </button>

      <span style={{ margin: "0 10px" }}>Página {pagina}</span>

      <button
        onClick={() => setPagina(pagina + 1)}
        disabled={
          vista === "producto"
            ? productos.length < LIMITE
            : vista === "categoria"
            ? categorias.length < LIMITE
            : marcas.length < LIMITE
        }
      >
        Siguiente
      </button>
    </div>

    {/* TABLA DINÁMICA */}
    <div className={styles.tablaWrapper}>
      <table>
        <thead>
          <tr>
            <th>N°</th>
            {vista === "producto" && (
              <>
                <th>Producto</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Acciones</th>
              </>
            )}

            {vista === "categoria" && (
              <>
                <th>Categoría</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </>
            )}

            {vista === "marca" && (
              <>
                <th>Marca</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
{/*///////////////////////////////////////////////////////////////////////////////////////////////*/}
{/*/////////////////////////////////   PRODUCTO   ////////////////////////////////////////////////*/}
{/*///////////////////////////////////////////////////////////////////////////////////////////////*/}
          {vista === "producto" &&
            productos.map((p, index) => (
              <tr key={p.prdcid}>
                <td>{(pagina - 1) * LIMITE + index + 1}</td>

                <td>
                  <img
                    className={styles.imgTabla}
                    src={getImagenProducto(p.prdcimgnombrebucket)}
                  />
                </td>

                <td>{p.prdcimgnombre}</td>

                <td>S/ {p.prdcprecio?.toFixed(2)}</td>

                <td>
                  {p.categoria?.ctgraimgnombrebucket ? (
                    <img
                      className={styles.imgTabla}
                      src={getImagenCategoria(p.categoria.ctgraimgnombrebucket)}
                    />
                  ) : (
                    <span className={styles.sinImagen}>Sin imagen</span>
                  )}
                </td>

                <td>
                  {p.marca?.marcaimgnombrebucket ? (
                    <img
                      className={styles.imgTabla}
                      src={getImagenMarca(p.marca.marcaimgnombrebucket)}
                    />
                  ) : (
                    <span className={styles.sinImagen}>Sin imagen</span>
                  )}
                </td>

                <td>
                  <button
                    onClick={() =>
                      setIdEditando({ id: p.prdcid, type: "producto" })
                    }
                  >
                    Editar
                  </button>
                  <button onClick={() => handleEliminarProducto(p.prdcid)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

{/*///////////////////////////////////////////////////////////////////////////////////////////////*/}
{/*////////////////////////////////   CATEGORIA   ////////////////////////////////////////////////*/}
{/*///////////////////////////////////////////////////////////////////////////////////////////////*/}
          {vista === "categoria" &&
            categorias.map((c, index) => (
              <tr key={c.ctgraid}>
                <td>{(pagina - 1) * LIMITE + index + 1}</td>

                <td>{c.ctgraimgnombre}</td>

                <td>
                  {c.ctgraimgnombrebucket ? (
                    <img
                      className={styles.imgTabla}
                      src={getImagenCategoria(c.ctgraimgnombrebucket)}
                    />
                  ) : (
                    <span className={styles.sinImagen}>Sin imagen</span>
                  )}
                </td>
                <td>
                  <button onClick={() => setIdEditando({ id: c.ctgraid, type: "categoria" })}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminarCategoria(c.ctgraid)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

{/*///////////////////////////////////////////////////////////////////////////////////////////////*/}
{/*////////////////////////////////////   MARCA   ////////////////////////////////////////////////*/}
{/*///////////////////////////////////////////////////////////////////////////////////////////////*/}
          {vista === "marca" &&
            marcas.map((m, index) => (
              <tr key={m.marcaid}>
                <td>{(pagina - 1) * LIMITE + index + 1}</td>

                <td>{m.marcaimgnombre}</td>

                <td>
                  {m.marcaimgnombrebucket ? (
                    <img
                      className={styles.imgTabla}
                      src={getImagenMarca(m.marcaimgnombrebucket)}
                    />
                  ) : (
                    <span className={styles.sinImagen}>Sin imagen</span>
                  )}
                </td>
                <td>
                  <button onClick={() => setIdEditando({ id: m.marcaid, type: "marca" })}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminarMarca(m.marcaid)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);
};
export default Seccion_2;