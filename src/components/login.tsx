import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  Building2, 
  Package, 
  Truck,
  BarChart3,
  AlertCircle,
  Loader2
} from "lucide-react";

interface LoginProps {
  onLogin: (userData: UserData) => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee" | "client";
  warehouse?: string;
  branch?: string;
  avatar?: string;
}

// Mock users for demonstration
const mockUsers: Array<UserData & { password: string }> = [
  {
    id: "1",
    email: "admin@inventory.com",
    password: "admin123",
    name: "Carlos Rodríguez",
    role: "admin",
    warehouse: "Almacén Central",
    avatar: "CR"
  },
  {
    id: "2", 
    email: "manager@inventory.com",
    password: "manager123",
    name: "Ana García",
    role: "manager",
    warehouse: "Almacén Norte",
    branch: "Sucursal Norte",
    avatar: "AG"
  },
  {
    id: "3",
    email: "employee@inventory.com", 
    password: "employee123",
    name: "Luis Mendoza",
    role: "employee",
    warehouse: "Almacén Sur",
    avatar: "LM"
  },
  {
    id: "4",
    email: "client@inventory.com",
    password: "client123", 
    name: "Rosa Mendoza",
    role: "client",
    avatar: "RM"
  }
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find user in mock data
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userData } = user;
      
      // Save to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(userData));
      }
      
      onLogin(userData);
    } else {
      setError("Credenciales incorrectas. Verifique su email y contraseña.");
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    // In a real app, this would send a reset email
    setTimeout(() => {
      setShowForgotPassword(false);
      setError("Se ha enviado un enlace de recuperación a su email.");
    }, 2000);
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-accent/50 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-chart-1/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chart-3/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-1 mb-4 shadow-lg">
            <Package className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Inventario
          </h1>
          <p className="text-muted-foreground">
            Accede a tu panel de control
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-foreground">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant={error.includes("enviado") ? "default" : "destructive"} className="border-border/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input-background border-border/50 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-input-background border-border/50 focus:border-primary focus:ring-primary/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Recordar sesión
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                  onClick={handleForgotPassword}
                  disabled={showForgotPassword}
                >
                  {showForgotPassword ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    "¿Olvidaste tu contraseña?"
                  )}
                </Button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground shadow-lg transition-all duration-200"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Iniciar Sesión
                  </div>
                )}
              </Button>
            </form>

            <Separator className="bg-border/50" />

            {/* Quick Login Demo Section */}
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Prueba rápida - Selecciona un rol:
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-3 border-border/50 hover:bg-accent/50 hover:border-primary/50 transition-all"
                  onClick={() => quickLogin("admin@inventory.com", "admin123")}
                  disabled={isLoading}
                >
                  <Shield className="h-5 w-5 text-chart-1" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Administrador</p>
                    <p className="text-xs text-muted-foreground">Acceso completo</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-3 border-border/50 hover:bg-accent/50 hover:border-primary/50 transition-all"
                  onClick={() => quickLogin("manager@inventory.com", "manager123")}
                  disabled={isLoading}
                >
                  <Building2 className="h-5 w-5 text-chart-2" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Gerente</p>
                    <p className="text-xs text-muted-foreground">Gestión almacén</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-3 border-border/50 hover:bg-accent/50 hover:border-primary/50 transition-all"
                  onClick={() => quickLogin("employee@inventory.com", "employee123")}
                  disabled={isLoading}
                >
                  <Truck className="h-5 w-5 text-chart-3" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Empleado</p>
                    <p className="text-xs text-muted-foreground">Operaciones</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-3 border-border/50 hover:bg-accent/50 hover:border-primary/50 transition-all"
                  onClick={() => quickLogin("client@inventory.com", "client123")}
                  disabled={isLoading}
                >
                  <BarChart3 className="h-5 w-5 text-chart-4" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Cliente</p>
                    <p className="text-xs text-muted-foreground">Panel cliente</p>
                  </div>
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/30">
              <p>© 2024 Sistema de Inventario. Todos los derechos reservados.</p>
              <p className="mt-1">Versión 1.0.0</p>
            </div>
          </CardContent>
        </Card>

        {/* System Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
            <Package className="h-6 w-6 text-chart-1 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Gestión de Inventario</p>
          </div>
          <div className="p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
            <Truck className="h-6 w-6 text-chart-2 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Control de Traslados</p>
          </div>
          <div className="p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
            <BarChart3 className="h-6 w-6 text-chart-3 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Reportes en Tiempo Real</p>
          </div>
        </div>
      </div>
    </div>
  );
}