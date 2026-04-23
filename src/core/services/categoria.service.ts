import { supabase } from "../../lib/supabase";

export type Categoria = {
  ctgraid: number;
  ctgraimgnombre: string;
  ctgraimgnombrebucket: string;
};

const SELECT_CATEGORIA = `
  ctgraid,
  ctgraimgnombre,
  ctgraimgnombrebucket
`;

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////     listarCategoriasPaginacion     ////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const listarCategoriasPaginacion = async (
  pagina: number,
  limite: number
): Promise<Categoria[]> => {
  const desde = (pagina - 1) * limite;
  const hasta = desde + limite - 1;

  const { data, error } = await supabase
  .from("categoria")
  .select(SELECT_CATEGORIA)
  .order("ctgraid", { ascending: true }) // 🔥 CLAVE
  .range(desde, hasta);

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data as Categoria[];
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////        listarCategorias       /////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const listarCategorias = async () => {
  const { data, error } = await supabase
    .from("categoria")
    .select(SELECT_CATEGORIA);

  if (error) {
    console.error("Error al listar categorías:", error);
    return [];
  }

  return data;
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////        obtenerCategoriaPorId       ///////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const obtenerCategoriaPorId = async (id: number): Promise<Categoria | null> => {
  const { data, error } = await supabase
    .from("categoria")
    .select(SELECT_CATEGORIA)
    .eq("ctgraid", id)
    .single();

  if (error) {
    console.error("Error al listar categoria por ID:", error);
    return null;
  }
  return data as Categoria;
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////        actualizarCategoriaPorId       /////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const actualizarCategoriaPorId = async (
  id: number,
  categoria: Partial<Categoria>,
  nuevaImagen?: File
): Promise<Categoria | null> => {

  try {

    // 🔍 1. obtener categoria actual (para saber imagen anterior)
    const categoriaActual = await obtenerCategoriaPorId(id);

    if (!categoriaActual) {
      console.error("Categoria no encontrado");
      return null;
    }

    let nombreBucket = categoria.ctgraimgnombrebucket;

    // 🖼️ 2. si hay nueva imagen → reemplazar flujo completo
    if (nuevaImagen) {

      // eliminar imagen anterior
      if (categoriaActual.ctgraimgnombrebucket) {
        await eliminarImagenCategoria(categoriaActual.ctgraimgnombrebucket);
      }

      // subir nueva imagen
      const nuevoNombre = await subirImagenCategoria(nuevaImagen);

      if (!nuevoNombre) {
        console.error("Error al subir nueva imagen");
        return null;
      }

      nombreBucket = nuevoNombre;
    }

    // 📦 3. construir updateData
    const updateData: Partial<Categoria> = {};

    if (categoria.ctgraimgnombre !== undefined)
      updateData.ctgraimgnombre = categoria.ctgraimgnombre;

    if (nombreBucket !== undefined)
      updateData.ctgraimgnombrebucket = nombreBucket;

    // 🚨 evitar update vacío
    if (Object.keys(updateData).length === 0) {
      console.warn("No hay datos para actualizar");
      return null;
    }

    // 💾 4. actualizar en BD
    const { data, error } = await supabase
      .from("categoria")
      .update(updateData)
      .eq("ctgraid", id)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar categoria:", error.message);
      return null;
    }

    return data as Categoria;

  } catch (err) { 
    console.error("Error general:", err);
    return null;
  }
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////        eliminarCategoriaPorId       ///////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const eliminarCategoriaPorId = async (id: number): Promise<boolean> => {
  if (!id) return false;

  try {
    // 1. Primero obtenemos la categoria para saber el nombre de la imagen
    const { data: categoria, error: fetchError } = await supabase
      .from("categoria")
      .select("ctgraimgnombrebucket")
      .eq("cgtra1d", id)
      .single();

    if (fetchError || !categoria) {
      console.error("Error al obtener categorias:", fetchError?.message);
      return false;
    }

    const imagenPath = `categoria/${categoria.ctgraimgnombrebucket}`;

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
      .from("categoria")
      .delete()
      .eq("ctgraid", id);

    if (deleteError) {
      console.error("Error al eliminar categoria:", deleteError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error general:", err);
    return false;
  }
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////        eliminarImagenCategoria       //////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const eliminarImagenCategoria = async (nombre: string): Promise<boolean> => {
  if (!nombre) return false;

  const { error } = await supabase.storage
    .from("imagenes")
    .remove([`categoria/${nombre}`]);

  if (error) {
    console.error("Error al eliminar imagen:", error.message);
    return false;
  }

  return true;
};

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////        subirImagenCategoria       /////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const subirImagenCategoria = async (file: File) => {
  const nombreArchivo = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("imagenes")
    .upload(`categoria/${nombreArchivo}`, file, {
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
// ////////////////////////        getImagenCategoria       //////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
export const getImagenCategoria = (nombreBucket: string) => {
  if (!nombreBucket) return ""; // evita errores

  const { data } = supabase
    .storage
    .from("imagenes")
    .getPublicUrl(`categoria/${nombreBucket}`);

  return data.publicUrl;
};
