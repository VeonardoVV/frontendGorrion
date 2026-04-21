import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Plus, MapPin, User, Package, Edit, Trash2, Search } from "lucide-react";

interface Warehouse {
  id: number;
  name: string;
  address: string;
  manager: string;
  status: "Activo" | "Inactivo";
  sections: Section[];
  totalProducts: number;
}

interface Section {
  id: number;
  name: string;
  description: string;
  capacity: number;
  currentStock: number;
  productCategories: string[];
}

const initialWarehouses: Warehouse[] = [
  {
    id: 1,
    name: "Almacén Central",
    address: "Av. Principal 123, Lima",
    manager: "Carlos Rodríguez",
    status: "Activo",
    totalProducts: 1250,
    sections: [
      { id: 1, name: "Sección A - Electrónicos", description: "Productos electrónicos y tecnológicos", capacity: 500, currentStock: 340, productCategories: ["Laptops", "Smartphones", "Accesorios"] },
      { id: 2, name: "Sección B - Hogar", description: "Artículos para el hogar", capacity: 300, currentStock: 220, productCategories: ["Muebles", "Decoración", "Cocina"] },
      { id: 3, name: "Sección C - Textiles", description: "Ropa y textiles", capacity: 400, currentStock: 380, productCategories: ["Ropa", "Zapatos", "Accesorios"] }
    ]
  },
  {
    id: 2,
    name: "Almacén Norte",
    address: "Jr. Comercio 456, Trujillo",
    manager: "Ana García",
    status: "Activo",
    totalProducts: 800,
    sections: [
      { id: 4, name: "Sección Norte A", description: "Productos generales", capacity: 600, currentStock: 480, productCategories: ["Variados", "Promocionales"] },
      { id: 5, name: "Sección Norte B", description: "Almacén de reserva", capacity: 400, currentStock: 320, productCategories: ["Stock de reserva"] }
    ]
  },
  {
    id: 3,
    name: "Almacén Sur",
    address: "Av. Los Olivos 789, Arequipa",
    manager: "Luis Mendoza",
    status: "Activo",
    totalProducts: 650,
    sections: [
      { id: 6, name: "Sección Sur A", description: "Productos regionales", capacity: 500, currentStock: 420, productCategories: ["Productos locales", "Artesanías"] }
    ]
  }
];

export function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateWarehouseOpen, setIsCreateWarehouseOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWarehouse = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newWarehouse: Warehouse = {
      id: Date.now(),
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      manager: formData.get("manager") as string,
      status: "Activo",
      sections: [],
      totalProducts: 0
    };

    setWarehouses([...warehouses, newWarehouse]);
    setIsCreateWarehouseOpen(false);
  };

  const handleCreateSection = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWarehouse) return;

    const formData = new FormData(event.currentTarget);
    
    const newSection: Section = {
      id: Date.now(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      capacity: parseInt(formData.get("capacity") as string),
      currentStock: 0,
      productCategories: (formData.get("categories") as string).split(",").map(cat => cat.trim())
    };

    setWarehouses(warehouses.map(warehouse => 
      warehouse.id === selectedWarehouse.id 
        ? { ...warehouse, sections: [...warehouse.sections, newSection] }
        : warehouse
    ));
    setIsCreateSectionOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Almacenes</h2>
          <p className="text-muted-foreground">Administra almacenes, secciones y responsables</p>
        </div>
        <Dialog open={isCreateWarehouseOpen} onOpenChange={setIsCreateWarehouseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Almacén
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Almacén</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo almacén
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWarehouse} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Almacén</Label>
                <Input id="name" name="name" placeholder="Ej: Almacén Central" required />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Textarea id="address" name="address" placeholder="Dirección completa" required />
              </div>
              <div>
                <Label htmlFor="manager">Responsable</Label>
                <Input id="manager" name="manager" placeholder="Nombre del responsable" required />
              </div>
              <Button type="submit" className="w-full">Crear Almacén</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar almacenes o responsables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{warehouse.name}</span>
                </CardTitle>
                <Badge variant={warehouse.status === "Activo" ? "default" : "secondary"}>
                  {warehouse.status}
                </Badge>
              </div>
              <CardDescription>{warehouse.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{warehouse.manager}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{warehouse.totalProducts} productos</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {warehouse.sections.length} secciones
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedWarehouse(warehouse)}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warehouse Detail Modal */}
      {selectedWarehouse && (
        <Dialog open={!!selectedWarehouse} onOpenChange={() => setSelectedWarehouse(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{selectedWarehouse.name}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedWarehouse.address} - Responsable: {selectedWarehouse.manager}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Secciones del Almacén</h3>
                <Dialog open={isCreateSectionOpen} onOpenChange={setIsCreateSectionOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Sección
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Sección</DialogTitle>
                      <DialogDescription>
                        Agrega una nueva sección al almacén {selectedWarehouse.name}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSection} className="space-y-4">
                      <div>
                        <Label htmlFor="section-name">Nombre de la Sección</Label>
                        <Input id="section-name" name="name" placeholder="Ej: Sección A - Electrónicos" required />
                      </div>
                      <div>
                        <Label htmlFor="section-description">Descripción</Label>
                        <Textarea id="section-description" name="description" placeholder="Describe el tipo de productos" required />
                      </div>
                      <div>
                        <Label htmlFor="section-capacity">Capacidad</Label>
                        <Input id="section-capacity" name="capacity" type="number" placeholder="Número máximo de productos" required />
                      </div>
                      <div>
                        <Label htmlFor="section-categories">Categorías (separadas por comas)</Label>
                        <Input id="section-categories" name="categories" placeholder="Electrónicos, Laptops, Smartphones" required />
                      </div>
                      <Button type="submit" className="w-full">Crear Sección</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {selectedWarehouse.sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{section.name}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Capacidad</p>
                          <p className="font-medium">{section.capacity} productos</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Stock Actual</p>
                          <p className="font-medium">{section.currentStock} productos</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Categorías:</p>
                        <div className="flex flex-wrap gap-2">
                          {section.productCategories.map((category, index) => (
                            <Badge key={index} variant="outline">{category}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Ocupación</span>
                          <span>{Math.round((section.currentStock / section.capacity) * 100)}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(section.currentStock / section.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}