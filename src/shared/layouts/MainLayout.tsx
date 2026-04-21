import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { NavigationItem } from "../../types";

interface Props {
    currentUser: any;
    onLogout: () => void;
}

export function MainLayout({ currentUser, onLogout }: Props) {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar currentUser={currentUser} onLogout={onLogout} />
            <main className="flex-1 overflow-auto flex flex-col">
                <TopBar currentUser={currentUser} onLogout={onLogout} />
                <div className="flex-1 overflow-auto p-4">
                    {/* Aquí se renderiza la página según la ruta */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
