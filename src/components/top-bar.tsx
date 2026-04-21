import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Bell, Settings, User, LogOut, ChevronDown, Menu, Package } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee" | "client";
  warehouse?: string;
  branch?: string;
  avatar?: string;
}

interface TopBarProps {
  currentUser: UserData | null;
  onLogout: () => void;
  onMenuToggle: () => void;
}

export function TopBar({ currentUser, onLogout, onMenuToggle }: TopBarProps) {
  if (!currentUser) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-chart-1/20 text-chart-1 border-chart-1/30";
      case "manager": return "bg-chart-2/20 text-chart-2 border-chart-2/30";
      case "employee": return "bg-chart-3/20 text-chart-3 border-chart-3/30";
      case "client": return "bg-chart-4/20 text-chart-4 border-chart-4/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Admin";
      case "manager": return "Gerente";
      case "employee": return "Empleado";
      case "client": return "Cliente";
      default: return role;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm bg-card/95">
      {/* Mobile Menu Button + Logo */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Mobile Logo */}
        <div className="flex items-center space-x-2 lg:hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-1 rounded-lg flex items-center justify-center shadow-sm">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm">Control de Inventario</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1" />
      
      {/* User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-chart-1 rounded-full"></span>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {currentUser.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs px-2 py-0 ${getRoleColor(currentUser.role)}`}>
                      {getRoleLabel(currentUser.role)}
                    </Badge>
                  </div>
                </div>
                <Avatar className="h-8 w-8 border border-border/50">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-chart-1/20 text-primary font-semibold text-sm">
                    {currentUser.avatar || currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="font-medium text-foreground">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              {currentUser.warehouse && (
                <p className="text-xs text-muted-foreground mt-1">
                  📦 {currentUser.warehouse}
                </p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" 
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Logout Button */}
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 hidden lg:flex"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Salir
        </Button>
      </div>
    </div>
  );
}