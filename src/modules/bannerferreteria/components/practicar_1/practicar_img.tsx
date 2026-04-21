import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

const Practicar_1 = () => {
  const [imagenUrl, setImagenUrl] = useState<string>("");

  useEffect(() => {
    const obtenerImagen = async () => {
      // 👇 nombre exacto del archivo en el bucket
      const nombreArchivo = "ss.webp";

      const { data } = supabase.storage
        .from("BannerFerreteria")
        .getPublicUrl(nombreArchivo);

      setImagenUrl(data.publicUrl);
    };
    obtenerImagen();
  }, []);

  return (
    <div>
      <h2>Imagen específica</h2>

      {imagenUrl && (
        <img src={imagenUrl} width="300" alt="banner" />
      )}
    </div>
  );
};

export default Practicar_1;