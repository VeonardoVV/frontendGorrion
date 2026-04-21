// con esto llamo a todas las imagenes de un bucket por ejemplo BannerFerreteria
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
const Practicar = () => {
 const [imagenes, setImagenes] = useState<string[]>([]);
 useEffect(() => {
  const obtenerImagenes = async () => {
    const { data, error } = await supabase.storage
    .from("BannerFerreteria")
    .list("", {limit: 100, offset:0,});

    if(error) {
      console.error("Error:", error.message);
      return;
    }
    const urls = data.map((file) => {
      const {data: urlData } = supabase.storage 
      .from("BannerFerreteria")
      .getPublicUrl(file.name);
      return urlData.publicUrl;
    });
    setImagenes(urls);
  };
  obtenerImagenes();
 },[])
  return (
      <div>
        {imagenes.map((url, i) => (
          <img key={i} src={url} width="200" alt="img" />
        ))}
      </div>
  );
}
export default Practicar;