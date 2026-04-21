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

import Logo from "../components/layout/SideBar/components/Logo/logo";
import Icon from "../components/layout/SideBar/components/Icon/icon";
import Banner from "../components/layout/SideBar/components/Banner/Banner";

import LogoFerreteria from "../../modules/logoferreteria/pages/logoferreteriaPage";
import TestimonioFerreteria from "../../modules/testimonioferreteria/pages/testimonioferreteriaPage";


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

export default function SeeProductLayout() {
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
            {/* Header */}


            {/* usuario */}

            <Outlet />
            <div className="p-4 border-t border-border/50">

                <Button
                    onClick={CerrarSession}
                    variant="outline"
                    className="w-full justify-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </Button>
            </div>
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
const [view, setView] = useState("ferreteria");
    return (
        <>
            <div>
                <NavBar_1/>
                <SideBar/>
                <TestimonioFerreteria />

            </div>
        </>
    );
}