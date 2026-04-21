import style from "./bannerferreteriaPage.module.css";
import Seccion_1 from "../components/seccion_1/seccion_1";
import Practicar from "../components/practicar/practicar_img";
import Practicar_1 from "../components/practicar_1/practicar_img";
// import Seccion_8 from "../components/seccion_8/seccion_8";

export default function BannerFerreteria() {
    return (
        <div className={style.contenidoferreteria}>
            <Seccion_1/>
            {/* <Practicar/>
            <Practicar_1/> */}

        </div>
        
    );
}