// import style from "./ProductPage.module.css";
import style from "./CartPage.module.css";

import Seccion_1 from "../components/seccion_1/seccion_1";


// import Seccion_4 from "../components/seccion_4/seccion_4";
// import Seccion_5 from "../components/seccion_5/seccion_5";
// import Seccion_6 from "../components/seccion_6/seccion_6";
// import Seccion_7 from "../components/seccion_7/seccion_7";
// import Seccion_8 from "../components/seccion_8/seccion_8";

export default function ProductPage() {
    return (
        <div className={style.contenidoHome}>
            <p>Carrito de Compra</p>
            <Seccion_1/>            
        </div>
        
    );
}