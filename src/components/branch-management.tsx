import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Building2, MapPin, Phone, Mail, Users, TrendingUp, Edit, Trash2, Search } from "lucide-react";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  type: "Principal" | "Secundaria" | "Punto de Venta";
  status: "Activo" | "Inactivo";
  salesThisMonth: number;
  employeeCount: number;
  connectedWarehouses: string[];
  openingHours: string;
}

const initialBranches: Branch[] = [
  {
    id: 1,
    name: "Sucursal Central Lima",
    address: "Av. Javier Prado 1234, San Isidro, Lima",
    phone: "+51 1 234-5678",
    email: "central@empresa.com",
    manager: "María González",
    type: "Principal",
    status: "Activo",
    salesThisMonth: 156780,
    employeeCount: 25,
    connectedWarehouses: ["Almacén Central", "Almacén Norte"],
    openingHours: "L-V 8:00-18:00, S 9:00-15:00"
  },
  {
    id: 2,
    name: "Sucursal Miraflores",
    address: "Av. Larco 789, Miraflores, Lima",
    phone: "+51 1 345-6789",
    email: "miraflores@empresa.com",
    manager: "Carlos Ruiz",
    type: "Secundaria",
    status: "Activo",
    salesThisMonth: 89340,
    employeeCount: 12,
    connectedWarehouses: ["Almacén Central"],
    openingHours: "L-S 10:00-20:00, D 11:00-18:00"
  },
  {
    id: 3,
    name: "Sucursal Norte",
    address: "Av. Alfredo Mendiola 2456, Los Olivos, Lima",
    phone: "+51 1 456-7890",
    email: "norte@empresa.com",
    manager: "Ana Delgado",
    type: "Secundaria",
    status: "Activo",
    salesThisMonth: 67890,
    employeeCount: 15,
    connectedWarehouses: ["Almacén Norte", "Almacén Central"],
    openingHours: "L-V 9:00-19:00, S 10:00-16:00"
  },
  {
    id: 4,
    name: "Punto de Venta Plaza Norte",
    address: "C.C. Plaza Norte, Independencia, Lima",
    phone: "+51 1 567-8901",
    email: "plazanorte@empresa.com",
    manager: "Luis Torres",
    type: "Punto de Venta",
    status: "Activo",
    salesThisMonth: 45230,
    employeeCount: 8,
    connectedWarehouses: ["Almacén Norte"],
    openingHours: "L-D 10:00-22:00"
  },
  {
    id: 5,
    name: "Sucursal Arequipa",
    address: "Av. Ejército 567, Cerro Colorado, Arequipa",
    phone: "+51 54 123-4567",
    email: "arequipa@empresa.com",
    manager: "Rosa Mendoza",
    type: "Principal",
    status: "Activo",
    salesThisMonth: 98560,
    employeeCount: 18,
    connectedWarehouses: ["Almacén Sur"],
    openingHours: "L-V 8:30-18:30, S 9:00-15:00"
  }
];

export function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isCreateBranchOpen, setIsCreateBranchOpen] = useState(false);

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || branch.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleCreateBranch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newBranch: Branch = {
      id: Date.now(),
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      manager: formData.get("manager") as string,
      type: formData.get("type") as Branch["type"],
      status: "Activo",
      salesThisMonth: 0,
      employeeCount: parseInt(formData.get("employeeCount") as string) || 0,
      connectedWarehouses: [],
      openingHours: formData.get("openingHours") as string,
    };

    setBranches([...branches, newBranch]);
    setIsCreateBranchOpen(false);
  };

  const totalSales = branches.reduce((sum, branch) => sum + branch.salesThisMonth, 0);
  const totalEmployees = branches.reduce((sum, branch) => sum + branch.employeeCount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Sucursales</h2>
          <p className="text-muted-foreground">Administra sucursales, puntos de venta y su personal</p>
        </div>
        <Dialog open={isCreateBranchOpen} onOpenChange={setIsCreateBranchOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sucursal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Sucursal</DialogTitle>
              <DialogDescription>
                Completa la información de la nueva sucursal o punto de venta
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="branch-name">Nombre de la Sucursal</Label>
                  <Input id="branch-name" name="name" placeholder="Ej: Sucursal Centro" required />
                </div>
                <div>
                  <Label htmlFor="branch-type">Tipo</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Principal">Principal</SelectItem>
                      <SelectItem value="Secundaria">Secundaria</SelectItem>
                      <SelectItem value="Punto de Venta">Punto de Venta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="branch-address">Dirección</Label>
                <Textarea id="branch-address" name="address" placeholder="Dirección completa" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="branch-phone">Teléfono</Label>
                  <Input id="branch-phone" name="phone" placeholder="+51 1 234-5678" required />
                </div>
                <div>
                  <Label htmlFor="branch-email">Email</Label>
                  <Input id="branch-email" name="email" type="email" placeholder="sucursal@empresa.com" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="branch-manager">Encargado</Label>
                  <Input id="branch-manager" name="manager" placeholder="Nombre del encargado" required />
                </div>
                <div>
                  <Label htmlFor="branch-employees">Número de Empleados</Label>
                  <Input id="branch-employees" name="employeeCount" type="number" placeholder="10" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="branch-hours">Horario de Atención</Label>
                <Input id="branch-hours" name="openingHours" placeholder="L-V 9:00-18:00, S 10:00-15:00" required />
              </div>
              
              <Button type="submit" className="w-full">Crear Sucursal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sucursales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">
              {branches.filter(b => b.status === "Activo").length} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">En todas las sucursales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Ventas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {Math.round(totalSales / branches.length).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Por sucursal</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar sucursales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="Principal">Principal</SelectItem>
            <SelectItem value="Secundaria">Secundaria</SelectItem>
            <SelectItem value="Punto de Venta">Punto de Venta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="truncate">{branch.name}</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Badge variant={branch.status === "Activo" ? "default" : "secondary"}>
                    {branch.status}
                  </Badge>
                  <Badge variant="outline">{branch.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{branch.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{branch.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Encargado</p>
                  <p className="font-medium">{branch.manager}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Empleados</p>
                  <p className="font-medium">{branch.employeeCount}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Ventas este mes</p>
                <p className="text-xl font-bold text-green-600">S/ {branch.salesThisMonth.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-2">Almacenes conectados:</p>
                <div className="flex flex-wrap gap-1">
                  {branch.connectedWarehouses.map((warehouse, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {warehouse}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedBranch(branch)}
                  className="flex-1"
                >
                  Ver Detalles
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Branch Detail Modal */}
      {selectedBranch && (
        <Dialog open={!!selectedBranch} onOpenChange={() => setSelectedBranch(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>{selectedBranch.name}</span>
              </DialogTitle>
              <DialogDescription>
                Información detallada de la sucursal
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Sucursal</p>
                      <Badge variant="outline">{selectedBranch.type}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <Badge variant={selectedBranch.status === "Activo" ? "default" : "secondary"}>
                        {selectedBranch.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Encargado</p>
                      <p className="font-medium">{selectedBranch.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Horario de Atención</p>
                      <p className="font-medium">{selectedBranch.openingHours}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contacto y Ubicación</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{selectedBranch.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{selectedBranch.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedBranch.email}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Personal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedBranch.employeeCount}</div>
                    <p className="text-sm text-muted-foreground">Empleados activos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ventas del Mes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">S/ {selectedBranch.salesThisMonth.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Enero 2024</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Almacenes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedBranch.connectedWarehouses.length}</div>
                    <p className="text-sm text-muted-foreground">Conectados</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Almacenes Conectados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedBranch.connectedWarehouses.map((warehouse, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {warehouse}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}