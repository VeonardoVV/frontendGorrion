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
