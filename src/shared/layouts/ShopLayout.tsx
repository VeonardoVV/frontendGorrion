import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "../../app/routes/auth"

import BarraSuperior from "../components/layout/BarraSuperior/BarraSuperior";
import NavBar from "../components/layout/NavBar/NavBar";
import NavBar_1 from "../components/layout/NavBar_1/NavBar_1";
import SideBar from "../components/layout/SideBar/SideBar";
import BarraInferior from "../components/layout/BarraInferior/BarraInferior";
import Ferreteria from "../../modules/ferreteria/pages/ferreteriaPage";


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
/* para la vista en mobil */
interface MobilSidebarProps {
    isMobilOpen: Boolean;
    onMobileToggle: (open: boolean) => void;
}

export default function ShopLayout() {
    /* extraer los datos del usuario localstore */
    const [dataUser, setDataUser] = useState<UserData | null>(null);
    /* activar el mobil */
    const [isMobilOpen, setIsMobilOpen] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        const usuarioAlmacenado = localStorage.getItem("user");
        if (usuarioAlmacenado) {
            setDataUser(JSON.parse(usuarioAlmacenado));
        }
    }, []);
    const Menu = () => (
        <div className="">
            <Outlet />
        </div>
    );

    const BarraMEnu = () => (
        <h1>hola</h1>
    );
    const CerrarSession = () => {
        logout();
        navigate("/")
    }
    /* vista para el mobil */
    const Mobil = ({ isMobilOpen, onMobileToggle }: MobilSidebarProps) => (
        <Sheet open={isMobilOpen} onOpenChange={onMobileToggle}>
            <SheetContent side="left" className="p-0 w-64">
                <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                <SheetDescription className="sr-only">
                    Navegación principal del sistema de control de inventario
                </SheetDescription>
                <Menu />
            </SheetContent>
        </Sheet>
    );

    return (
        <>
            <div>            
                <Menu/>
            </div>
        </>
    );
}