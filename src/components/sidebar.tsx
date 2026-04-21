import { useState } from "react";
import { 
  LayoutDashboard, 
  Warehouse, 
  Building2, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Settings, 
  MessageSquare, 
  User,
  Route,
  ChevronDown,
  ChevronRight,
  Package2,
  BarChart3,
  Users2,
  ShieldCheck,
  Database,
  Bell,
  MapPin,
  Truck,
  LogOut,
  Crown,
  Briefcase,
  HardHat
} from "lucide-react";
import { NavigationItem } from "../App";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee" | "client";
  warehouse?: string;
  branch?: string;
  avatar?: string;
}

interface SidebarProps {
  activeSection: NavigationItem;
  onSectionChange: (section: NavigationItem) => void;
  currentUser: UserData | null;
  onLogout: () => void;
  isMobileOpen: boolean;
  onMobileToggle: (open: boolean) => void;
}

interface SubMenuItem {
  id: NavigationItem;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationItemWithSub {
  id: NavigationItem | "inventory" | "sales_group" | "admin_group";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SubMenuItem[];
}

const navigationItems: NavigationItemWithSub[] = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard 
  },
  {
    id: "inventory",
    label: "Inventario",
    icon: Package,
    subItems: [
      { id: "warehouses", label: "Almacenes", icon: Warehouse },
      { id: "products", label: "Productos", icon: Package2 },
      { id: "transfers", label: "Traslados", icon: Route },
    ]
  },
  {
    id: "sales_group",
    label: "Ventas",
    icon: TrendingUp,
    subItems: [
      { id: "sales", label: "Ventas/Kardex", icon: BarChart3 },
      { id: "cart", label: "Carrito", icon: ShoppingCart },
    ]
  },
  { 
    id: "branches", 
    label: "Sucursales", 
    icon: Building2 
  },
  { 
    id: "client", 
    label: "Clientes", 
    icon: Users2 
  },
  { 
    id: "messages", 
    label: "Mensajería", 
    icon: MessageSquare 
  },
  {
    id: "admin_group",
    label: "Administración",
    icon: Settings,
    subItems: [
      { id: "admin", label: "Panel Admin", icon: ShieldCheck },
    ]
  },
];

export function Sidebar({ activeSection, onSectionChange, currentUser, onLogout, isMobileOpen, onMobileToggle }: SidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["inventory", "sales_group", "admin_group"])
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Crown;
      case "manager": return Briefcase;
      case "employee": return HardHat;
      case "client": return User;
      default: return User;
    }
  };

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
      case "admin": return "Administrador";
      case "manager": return "Gerente";
      case "employee": return "Empleado";
      case "client": return "Cliente";
      default: return role;
    }
  };

  // Filter navigation items based on user role
  const getFilteredNavigationItems = () => {
    if (!currentUser) return navigationItems;
    
    if (currentUser.role === "client") {
      return navigationItems.filter(item => 
        ["dashboard", "client", "messages"].includes(item.id as string)
      );
    }
    
    if (currentUser.role === "employee") {
      return navigationItems.filter(item => 
        !["admin_group"].includes(item.id as string)
      );
    }
    
    return navigationItems; // Admin and manager see everything
  };

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const isActive = (itemId: NavigationItem) => activeSection === itemId;

  const isParentActive = (item: NavigationItemWithSub) => {
    if (item.subItems) {
      return item.subItems.some(subItem => isActive(subItem.id));
    }
    return false;
  };

  const filteredNavigationItems = getFilteredNavigationItems();

  // Handle navigation with mobile menu close
  const handleNavigation = (section: NavigationItem) => {
    onSectionChange(section);
    onMobileToggle(false); // Close mobile menu after navigation
  };

  // Sidebar content component to avoid duplication
  const SidebarContent = () => (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-1 rounded-lg flex items-center justify-center shadow-sm">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Control de Inventario</h1>
            <p className="text-xs text-muted-foreground">Sistema Integral</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      {currentUser && (
        <div className="p-4 border-b border-border/50">
          <div className="bg-accent/30 rounded-lg p-3 border border-border/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-chart-1/20 text-primary font-semibold">
                    {currentUser.avatar || currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card flex items-center justify-center ${getRoleColor(currentUser.role)}`}>
                  {(() => {
                    const RoleIcon = getRoleIcon(currentUser.role);
                    return <RoleIcon className="h-2.5 w-2.5" />;
                  })()} 
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-xs px-2 py-0 ${getRoleColor(currentUser.role)}`}>
                    {getRoleLabel(currentUser.role)}
                  </Badge>
                </div>
                {currentUser.warehouse && (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    📦 {currentUser.warehouse}
                  </p>
                )}
                <p className="text-xs text-muted-foreground truncate mt-1">
                  ✉️ {currentUser.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigationItems.map((item) => {
          const Icon = item.icon;
          
          if (item.subItems) {
            const isOpen = openSections.has(item.id as string);
            const hasActiveChild = isParentActive(item);
            
            return (
              <Collapsible
                key={item.id}
                open={isOpen}
                onOpenChange={() => toggleSection(item.id as string)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={hasActiveChild ? "secondary" : "ghost"}
                    className={`w-full justify-between hover:bg-accent ${
                      hasActiveChild ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = isActive(subItem.id);
                      
                      return (
                        <Button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.id)}
                          variant={isSubActive ? "default" : "ghost"}
                          className={`w-full justify-start pl-8 ${
                            isSubActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent text-foreground hover:text-accent-foreground"
                          }`}
                        >
                          <SubIcon className="h-4 w-4 mr-3" />
                          <span>{subItem.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          } else {
            const isItemActive = isActive(item.id as NavigationItem);
            
            return (
              <Button
                key={item.id}
                onClick={() => handleNavigation(item.id as NavigationItem)}
                variant={isItemActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isItemActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-foreground hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Button>
            );
          }
        })}
      </nav>
      
      {/* Logout Button */}
      {currentUser && (
        <div className="p-4 border-t border-border/50">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema Online</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Versión 2.1.0 • © 2024
          </p>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            <span>Conexión Segura</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - visible on large screens */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Sheet overlay for mobile */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileToggle}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
          <SheetDescription className="sr-only">
            Navegación principal del sistema de control de inventario
          </SheetDescription>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}