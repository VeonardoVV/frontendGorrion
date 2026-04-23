import style from "./HomePage.module.css";
// import Seccion_1 from "../components/seccion_1/seccion_1";
import Seccion_2 from "../components/seccion_2/seccion_2";
// import Seccion_8 from "../components/seccion_8/seccion_8";

export default function HomePage() {
    return (
        <div className={style.contenidoHome}>
            {/* <Seccion_1/> */}
            <Seccion_2/>
        </div>
        
    );
}