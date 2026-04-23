import { supabase } from "../../lib/supabase";

export type Categoria = {
  ctgraid: number;
  ctgraimgnombre: string;
  ctgraimgnombrebucket: string;
};

//----------------------------------------------------------------------
//----- lista los registros  pero con paginación de 1000 registros -----
//----------------------------------------------------------------------
export const listarCategoriasPaginacion = async (
  pagina: number,
  limite: number
): Promise<Categoria[]> => {
  const desde = (pagina - 1) * limite;
  const hasta = desde + limite - 1;

  const { data, error } = await supabase
  .from("categoria")
  .select(`
    ctgraid,
    ctgraimgnombre,
    ctgraimgnombrebucket
  `)
  .order("ctgraid", { ascending: true }) // 🔥 CLAVE
  .range(desde, hasta);

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data as Categoria[];
};
// --------------------------------------------------------------------------
// lista todos los registros de mi tabla categoria
export const listarCategorias = async () => {
  const { data, error } = await supabase
    .from("categoria")
    .select("ctgraid, ctgraimgnombre, ctgraimgnombrebucket");

  if (error) {
    console.error("Error al listar categorías:", error);
    return [];
  }

  return data;
};
//----------------------------
export const eliminarCategoriaPorId = async (id: number): Promise<boolean> => {
  if (!id) return false;

  try {
    // 1. Primero obtenemos el producto para saber el nombre de la imagen
    const { data: producto, error: fetchError } = await supabase
      .from("producto")
      .select("prdcimgnombrebucket")
      .eq("prdcid", id)
      .single();

    if (fetchError || !producto) {
      console.error("Error al obtener producto:", fetchError?.message);
      return false;
    }

    const imagenPath = `producto/${producto.prdcimgnombrebucket}`;

    // 2. Eliminamos la imagen del bucket
    const { error: storageError } = await supabase.storage
      .from("imagenes")
      .remove([imagenPath]);

    if (storageError) {
      console.error("Error al eliminar imagen:", storageError.message);
      return false;
    }

    // 3. Eliminamos el registro de la BD
    const { error: deleteError } = await supabase
      .from("producto")
      .delete()
      .eq("prdcid", id);

    if (deleteError) {
      console.error("Error al eliminar producto:", deleteError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error general:", err);
    return false;
  }
};

//--------------------------------------------------
export const getImagenCategoria = (nombreBucket: string) => {
  if (!nombreBucket) return ""; // evita errores

  const { data } = supabase
    .storage
    .from("imagenes")
    .getPublicUrl(`categoria/${nombreBucket}`);

  return data.publicUrl;
};
