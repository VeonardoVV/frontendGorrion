import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { LogOut } from "lucide-react";


import BarraSuperior from "../components/layout/BarraSuperior/BarraSuperior";
import NavBar from "../components/layout/NavBar/NavBar";
import BarraInferior from "../components/layout/BarraInferior/BarraInferior";
import PanelAdmin from "../components/layout/AdminPanel/AdminPanel";
/*estilos*/
// import styles from "../components/layout/Layout.module.css"


/* datos para usuario */
interface UserData {
    id: number;
    ape: string,
    am: string,
    nom: string,
    role: string;
    photo: string;
    state: number;
    suc: string;
};


export default function SeeProductLayout() {
    /* extraer los datos del usuario localstore */
    const [dataUser, setDataUser] = useState<UserData | null>(null);
    /* activar el mobil */
    
    const navigate = useNavigate();
    useEffect(() => {
        const usuarioAlmacenado = localStorage.getItem("user");
        if (usuarioAlmacenado) {
            setDataUser(JSON.parse(usuarioAlmacenado));
        }
    }, []);
    const Menu = () => (
        <div className="">
            {/* Header */}


            {/* usuario */}

            <Outlet />
            
        </div>
    );

    const BarraMEnu = () => (
        <h1>hola</h1>
    );


    return (
        <>
            <div> 
                <BarraSuperior/>
                <PanelAdmin/>
                <Menu />   
            </div>
        </>
    );
}