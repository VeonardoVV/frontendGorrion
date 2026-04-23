import { supabase } from "../../lib/supabase";

export type Marca = {
  marcaid: number;
  marcaimgnombre: string;
  marcaimgnombrebucket: string;
};

const SELECT_MARCA = `
  marcaid,
  marcaimgnombre,
  marcaimgnombrebucket
`;

// ///////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////     listarMarcasPaginacion     //////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const listarMarcasPaginacion = async (
  pagina: number,
  limite: number
): Promise<Marca[]> => {
  const desde = (pagina - 1) * limite;
  const hasta = desde + limite - 1;

  const { data, error } = await supabase
  .from("marca")
  .select(SELECT_MARCA)
  .order("marcaid", { ascending: true }) // 🔥 CLAVE
  .range(desde, hasta);

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data as Marca[];
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////        listarMarcas       /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const listarMarcas = async () => {
  const { data, error } = await supabase
    .from("marca")
    .select(SELECT_MARCA);

  if (error) {
    console.error("Error al listar marcas:", error);
    return [];
  }

  return data;
};

// ///////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////        obtenerMarcaPorId       //////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const obtenerMarcaPorId = async (id: number): Promise<Marca | null> => {
  const { data, error } = await supabase
    .from("marca")
    .select(SELECT_MARCA)
    .eq("marcaid", id)
    .single();

  if (error) {
    console.error("Error al listar marca por ID:", error);
    return null;
  }
  return data as Marca;
};

// ///////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////        actualizarMarcaPorId       //////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const actualizarMarcaPorId = async (
  id: number,
  marca: Partial<Marca>,
  nuevaImagen?: File
): Promise<Marca | null> => {

  try {

    // 🔍 1. obtener marca actual (para saber imagen anterior)
    const marcaActual = await obtenerMarcaPorId(id);

    if (!marcaActual) {
      console.error("Marca no encontrado");
      return null;
    }

    let nombreBucket = marca.marcaimgnombrebucket;

    // 🖼️ 2. si hay nueva imagen → reemplazar flujo completo
    if (nuevaImagen) {

      // eliminar imagen anterior
      if (marcaActual.marcaimgnombrebucket) {
        await eliminarImagenMarca(marcaActual.marcaimgnombrebucket);
      }

      // subir nueva imagen
      const nuevoNombre = await subirImagenMarca(nuevaImagen);

      if (!nuevoNombre) {
        console.error("Error al subir nueva imagen");
        return null;
      }

      nombreBucket = nuevoNombre;
    }

    // 📦 3. construir updateData
    const updateData: Partial<Marca> = {};

    if (marca.marcaimgnombre !== undefined)
      updateData.marcaimgnombre = marca.marcaimgnombre;

    if (nombreBucket !== undefined)
      updateData.marcaimgnombrebucket = nombreBucket;

    // 🚨 evitar update vacío
    if (Object.keys(updateData).length === 0) {
      console.warn("No hay datos para actualizar");
      return null;
    }

    // 💾 4. actualizar en BD
    const { data, error } = await supabase
      .from("marca")
      .update(updateData)
      .eq("marcaid", id)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar marca:", error.message);
      return null;
    }

    return data as Marca;

  } catch (err) { 
    console.error("Error general:", err);
    return null;
  }
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////        eliminarMarcaPorId       ///////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const eliminarMarcaPorId = async (id: number): Promise<boolean> => {
  if (!id) return false;

  try {
    // 1. Primero obtenemos la marca para saber el nombre de la imagen
    const { data: marca, error: fetchError } = await supabase
      .from("marca")
      .select("marcaimgnombrebucket")
      .eq("marcaid", id)
      .single();

    if (fetchError || !marca) {
      console.error("Error al obtener marcas:", fetchError?.message);
      return false;
    }

    const imagenPath = `marca/${marca.marcaimgnombrebucket}`;

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
      .from("marca")
      .delete()
      .eq("marcaid", id);

    if (deleteError) {
      console.error("Error al eliminar marca:", deleteError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error general:", err);
    return false;
  }
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////        eliminarImagenMarca       //////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const eliminarImagenMarca = async (nombre: string): Promise<boolean> => {
  if (!nombre) return false;

  const { error } = await supabase.storage
    .from("imagenes")
    .remove([`marca/${nombre}`]);

  if (error) {
    console.error("Error al eliminar imagen:", error.message);
    return false;
  }

  return true;
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////        subirImagenMarca       /////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const subirImagenMarca = async (file: File) => {
  const nombreArchivo = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("imagenes")
    .upload(`marca/${nombreArchivo}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error al subir imagen:", error.message);
    return null;
  }

  return nombreArchivo; // 👈 esto guardas en BD
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////        getImagenMarca       //////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const getImagenMarca = (nombreBucket: string) => {
  if (!nombreBucket) return ""; // evita errores

  const { data } = supabase
    .storage
    .from("imagenes")
    .getPublicUrl(`marca/${nombreBucket}`);

  return data.publicUrl;
};
