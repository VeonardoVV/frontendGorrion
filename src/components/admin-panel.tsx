import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Bell, 
  Mail, 
  Lock, 
  Key, 
  Monitor, 
  HardDrive, 
  Activity, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Administrador" | "Gerente" | "Vendedor" | "Almacenero";
  status: "Activo" | "Inactivo";
  lastLogin: string;
  permissions: string[];
}

interface SystemLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  level: "Info" | "Warning" | "Error";
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    email: "carlos@empresa.com",
    role: "Administrador",
    status: "Activo",
    lastLogin: "2024-01-15 14:30",
    permissions: ["all"]
  },
  {
    id: 2,
    name: "María González",
    email: "maria@empresa.com",
    role: "Gerente",
    status: "Activo",
    lastLogin: "2024-01-15 12:15",
    permissions: ["ventas", "inventario", "reportes"]
  },
  {
    id: 3,
    name: "Ana García",
    email: "ana@empresa.com",
    role: "Vendedor",
    status: "Activo",
    lastLogin: "2024-01-15 09:45",
    permissions: ["ventas", "clientes"]
  },
  {
    id: 4,
    name: "Luis Mendoza",
    email: "luis@empresa.com",
    role: "Almacenero",
    status: "Inactivo",
    lastLogin: "2024-01-10 16:20",
    permissions: ["inventario", "almacenes"]
  }
];

const systemLogs: SystemLog[] = [
  {
    id: 1,
    timestamp: "2024-01-15 14:32:15",
    user: "Carlos Rodríguez",
    action: "Creó nuevo producto",
    module: "Inventario",
    details: "Producto: Laptop HP ProBook 450 G9",
    level: "Info"
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:28:43",
    user: "María González",
    action: "Procesó venta",
    module: "Ventas",
    details: "Venta #VE-2024-001 por S/ 3,526.44",
    level: "Info"
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:15:22",
    user: "Ana García",
    action: "Intento de acceso denegado",
    module: "Seguridad",
    details: "Intento de acceder al módulo de administración",
    level: "Warning"
  },
  {
    id: 4,
    timestamp: "2024-01-15 13:45:12",
    user: "Sistema",
    action: "Respaldo automático completado",
    module: "Sistema",
    details: "Respaldo de base de datos exitoso - 2.5GB",
    level: "Info"
  },
  {
    id: 5,
    timestamp: "2024-01-15 12:30:08",
    user: "Luis Mendoza",
    action: "Error en sincronización",
    module: "Inventario",
    details: "Fallo al sincronizar inventario con Almacén Norte",
    level: "Error"
  }
];

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    emailNotifications: true,
    lowStockAlerts: true,
    maintenanceMode: false,
    allowGuestAccess: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newUser: User = {
      id: Date.now(),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as User["role"],
      status: "Activo",
      lastLogin: "Nunca",
      permissions: (formData.get("permissions") as string).split(",").map(p => p.trim())
    };

    setUsers([...users, newUser]);
    setIsCreateUserOpen(false);
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "Activo" ? "Inactivo" : "Activo" }
        : user
    ));
  };

  const deleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateSystemSettings = (key: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const activeUsers = users.filter(u => u.status === "Activo").length;
  const totalUsers = users.length;
  const recentLogs = systemLogs.slice(0, 10);
  const errorLogs = systemLogs.filter(log => log.level === "Error").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Panel Administrativo</h2>
          <p className="text-muted-foreground">Configuración del sistema y gestión de usuarios</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              de {totalUsers} usuarios totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              Funcionando correctamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso de BD</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 GB</div>
            <p className="text-xs text-muted-foreground">
              de 10 GB disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errores Recientes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${errorLogs > 0 ? "text-destructive" : "text-green-600"}`}>
              {errorLogs}
            </div>
            <p className="text-xs text-muted-foreground">
              En las últimas 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Users Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra cuentas de usuario y permisos</CardDescription>
              </div>
              <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Completa la información del nuevo usuario del sistema
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user-name">Nombre Completo</Label>
                        <Input id="user-name" name="name" required />
                      </div>
                      <div>
                        <Label htmlFor="user-email">Email</Label>
                        <Input id="user-email" name="email" type="email" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user-role">Rol</Label>
                        <Select name="role" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Administrador">Administrador</SelectItem>
                            <SelectItem value="Gerente">Gerente</SelectItem>
                            <SelectItem value="Vendedor">Vendedor</SelectItem>
                            <SelectItem value="Almacenero">Almacenero</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="user-password">Contraseña Temporal</Label>
                        <Input id="user-password" name="password" type="password" required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="user-permissions">Permisos (separados por comas)</Label>
                      <Input 
                        id="user-permissions" 
                        name="permissions" 
                        placeholder="ventas, inventario, reportes"
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Crear Usuario</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead>Permisos</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Activo" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 2).map((permission, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {user.permissions.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{user.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.status === "Activo" ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* System Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Configuración del Sistema</span>
                </CardTitle>
                <CardDescription>Configuraciones generales del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Respaldo Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Respaldo diario automático de la base de datos
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(value) => updateSystemSettings('autoBackup', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Activar para realizar mantenimiento del sistema
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(value) => updateSystemSettings('maintenanceMode', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Acceso de Invitados</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir acceso limitado sin autenticación
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.allowGuestAccess}
                    onCheckedChange={(value) => updateSystemSettings('allowGuestAccess', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => updateSystemSettings('sessionTimeout', parseInt(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notificaciones</span>
                </CardTitle>
                <CardDescription>Configurar alertas y notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificaciones importantes por email
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.emailNotifications}
                    onCheckedChange={(value) => updateSystemSettings('emailNotifications', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Stock Bajo</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando los productos tengan stock bajo
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.lowStockAlerts}
                    onCheckedChange={(value) => updateSystemSettings('lowStockAlerts', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="email-server">Servidor SMTP</Label>
                  <Input id="email-server" placeholder="smtp.empresa.com" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email-user">Usuario SMTP</Label>
                    <Input id="email-user" placeholder="notificaciones@empresa.com" />
                  </div>
                  <div>
                    <Label htmlFor="email-password">Contraseña SMTP</Label>
                    <Input id="email-password" type="password" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Acciones del Sistema</CardTitle>
              <CardDescription>Realizar operaciones de mantenimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Crear Respaldo</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  <span>Restaurar Respaldo</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <RefreshCw className="h-6 w-6 mb-2" />
                  <span>Limpiar Cache</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Seguridad de Acceso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Máximo Intentos de Login</Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    value={systemSettings.maxLoginAttempts}
                    onChange={(e) => updateSystemSettings('maxLoginAttempts', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Política de Contraseñas</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona política" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básica (6+ caracteres)</SelectItem>
                      <SelectItem value="medium">Media (8+ caracteres, mayúsculas)</SelectItem>
                      <SelectItem value="strong">Fuerte (10+ caracteres, números, símbolos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Duración de Sesión (horas)</Label>
                  <Input id="session-duration" type="number" defaultValue="8" />
                </div>
                
                <Button className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Forzar Cambio de Contraseñas
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Permisos y Roles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Administrador</Label>
                    <p className="text-xs text-muted-foreground">Acceso total al sistema</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="default" className="text-xs">Todos los permisos</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Gerente</Label>
                    <p className="text-xs text-muted-foreground">Gestión de ventas e inventario</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">Ventas</Badge>
                      <Badge variant="secondary" className="text-xs">Inventario</Badge>
                      <Badge variant="secondary" className="text-xs">Reportes</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Vendedor</Label>
                    <p className="text-xs text-muted-foreground">Procesamiento de ventas</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">Ventas</Badge>
                      <Badge variant="secondary" className="text-xs">Clientes</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Almacenero</Label>
                    <p className="text-xs text-muted-foreground">Gestión de almacenes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">Inventario</Badge>
                      <Badge variant="secondary" className="text-xs">Almacenes</Badge>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Configurar Roles
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* System Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Registro de Actividad</span>
              </CardTitle>
              <CardDescription>Historial de actividades del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Nivel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm font-mono">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {log.details}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            log.level === "Error" ? "destructive" :
                            log.level === "Warning" ? "secondary" : "outline"
                          }
                        >
                          {log.level}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Modal */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Usuario: {selectedUser.name}</DialogTitle>
              <DialogDescription>
                Modificar información y permisos del usuario
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input id="edit-name" defaultValue={selectedUser.name} />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" defaultValue={selectedUser.email} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Rol</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Gerente">Gerente</SelectItem>
                      <SelectItem value="Vendedor">Vendedor</SelectItem>
                      <SelectItem value="Almacenero">Almacenero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-permissions">Permisos</Label>
                <Textarea 
                  id="edit-permissions" 
                  defaultValue={selectedUser.permissions.join(", ")}
                  placeholder="ventas, inventario, reportes..."
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1">Guardar Cambios</Button>
                <Button variant="outline" className="flex-1">
                  Restablecer Contraseña
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteUser(selectedUser.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}