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

//--------------------------------------------------
export const getImagenCategoria = (nombreBucket: string) => {
  if (!nombreBucket) return ""; // evita errores

  const { data } = supabase
    .storage
    .from("imagenes")
    .getPublicUrl(`categoria/${nombreBucket}`);

  return data.publicUrl;
};
