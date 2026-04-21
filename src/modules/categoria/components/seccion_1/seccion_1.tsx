import { useEffect, useState } from "react";
import styles from "./seccion_1.module.css";
import { supabase } from "../../../../app/services/apiSupabase";

const Seccion_1 = () => {
const getImagen = (nombre: string) => {
  const { data } = supabase
    .storage
    .from("imagenes") // 👈 nombre del bucket
    .getPublicUrl(`producto/${nombre}`);

  return data.publicUrl;
};

type Producto = {
  id_producto: number;
  img_producto_url: string;
  descripcion: string;
  precio: number;

  categoria: { nombre_categoria: string } | null;
  marca: { nombre_marca: string } | null;
  tipo: { nombre_tipo: string } | null;
};

const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
  const { data, error } = await supabase
    .from("producto")
    .select(`
      *,
      categoria ( nombre_categoria ),
      marca ( nombre_marca ),
      tipo ( nombre_tipo )
    `);

    if (error) {
      console.log("Error:", error);
    } else {
      setProductos(data || []);
    }
  };

  return (
    <div className={styles.seccion}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>

              <td>
                <img 
                  src={getImagen(p.img_producto_url)} 
                  alt="producto" 
                  width="50"
                />
              </td>

              <td>{p.descripcion}</td>
              <td>S/ {p.precio.toFixed(2)}</td>

              <td>{p.categoria?.nombre_categoria}</td>
              <td>{p.marca?.nombre_marca}</td>
              <td>{p.tipo?.nombre_tipo}</td>
              <td>
                <div className={styles.EditarEliminar}>
                  {/* Icono editar */}
                  <svg 
                    className={styles.iconoEditar}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-.92l8.06-8.06.92.92L5.92 19.58zM20.71 7.04a1.003 1.003 0 000-1.42L18.37 3.29a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z"
                    />
                  </svg>

                  {/* Icono eliminar */}
                  <svg 
                    className={styles.iconoEliminar}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      d="M6 7h12v14H6zM9 3h6l1 2H8l1-2zm1 6h2v10h-2V9zm4 0h2v10h-2V9z"
                    />
                  </svg>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default Seccion_1;