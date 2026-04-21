
import style from "./AuthPages.module.css"
import Seccion_1 from "../components/seccion_1/seccion_1";
import { supabase } from "../../../../app/services/apiSupabase";

export default function AuthPages() {
    return (
        <div className={style.contenido}>
            <Seccion_1/>
        </div>
        
    );
}