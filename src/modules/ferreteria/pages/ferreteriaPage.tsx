import { useState } from "react";
import style from "./ferreteriaPage.module.css";
import Seccion_1 from "../components/seccion_1/seccion_1";
import Seccion_2 from "../components/seccion_2/seccion_2";

export default function HomePage() {
  const [vista, setVista] = useState("monitor");

  return (
    <div className={style.contenidoferreteria}>
      
      {/* 👇 fila */}
      <div className={style.barra}>
        <p>Editor de pagina</p>

        <button
          className={vista === "monitor" ? style.activo : ""}
          onClick={() => setVista("monitor")}
        >
          Monitor
        </button>

        <button
          className={vista === "tablet" ? style.activo : ""}
          onClick={() => setVista("tablet")}
        >
          Tablet
        </button>

        <button
          className={vista === "celular" ? style.activo : ""}
          onClick={() => setVista("celular")}
        >
          Celular
        </button>
      </div>

      <div className={style.columnas}>
        <Seccion_1 vista={vista} />
        <Seccion_2 vista={vista} />
      </div>
    </div>
  );
}