import { supabase } from "../../lib/supabase";

export type Marca = {
  marcaid: number;
  marcaimgnombre: string;
  marcaimgnombrebucket: string;
};

//----------------------------------------------------
export const listarMarcasPaginacion = async (
  pagina: number,
  limite: number
): Promise<Marca[]> => {
  const desde = (pagina - 1) * limite;
  const hasta = desde + limite - 1;

  const { data, error } = await supabase
  .from("marca")
  .select(`
    marcaid,
    marcaimgnombre,
    marcaimgnombrebucket
  `)
  .order("marcaid", { ascending: true }) // 🔥 CLAVE
  .range(desde, hasta);

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data as Marca[];
};
//----------------------------------------------------
export const listarMarcas = async (
  pagina: number,
  limite: number
): Promise<Marca[]> => {
  const desde = (pagina - 1) * limite;
  const hasta = desde + limite - 1;

  const { data, error } = await supabase
  .from("marca")
  .select(`
    marcaid,
    marcaimgnombre,
    marcaimgnombrebucket
  `)
  .order("marcaid", { ascending: true }) // 🔥 CLAVE
  .range(desde, hasta);

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data as Marca[];
};
//-------------------------------------------
export const getImagenMarca = (nombreBucket: string) => {
  if (!nombreBucket) return ""; // evita errores

  const { data } = supabase
    .storage
    .from("imagenes")
    .getPublicUrl(`marca/${nombreBucket}`);

  return data.publicUrl;
};

//--------------------------------------
export const eliminarMarcaPorId = async (id: number): Promise<boolean> => {
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

//--------------------
export const findMarcaByBucketName = async (nombreBucket: string) => {
  if (!nombreBucket) return null;

  const { data, error } = await supabase
    .from("marca")
    .select("marcaid, marcaimgnombre, marcaimgnombrebucket")
    .eq("marcaimgnombrebucket", nombreBucket)
    .single();

  if (error) {
    console.error("Error buscando marca por bucket:", error.message);
    return null;
  }

  return data;
};
