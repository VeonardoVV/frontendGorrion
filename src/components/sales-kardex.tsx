import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Plus, TrendingUp, TrendingDown, Package, ShoppingCart, ArrowUpDown, Search, Filter, Calendar as CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface KardexEntry {
  id: number;
  date: string;
  type: "Entrada" | "Salida" | "Transferencia" | "Ajuste";
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  previousStock: number;
  newStock: number;
  location: string;
  reference: string;
  responsible: string;
  notes?: string;
}

interface Sale {
  id: number;
  date: string;
  customer: string;
  products: Array<{
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: "Completada" | "Pendiente" | "Cancelada";
  paymentMethod: string;
  branch: string;
  salesperson: string;
}

const kardexData: KardexEntry[] = [
  {
    id: 1,
    date: "2024-01-15",
    type: "Entrada",
    product: "Laptop HP ProBook 450 G9",
    sku: "HP-PB450-001",
    quantity: 20,
    unitPrice: 2200,
    totalValue: 44000,
    previousStock: 10,
    newStock: 30,
    location: "Almacén Central - Sección A",
    reference: "PO-2024-001",
    responsible: "Carlos Rodríguez"
  },
  {
    id: 2,
    date: "2024-01-15",
    type: "Salida",
    product: "Smartphone Samsung Galaxy A54",
    sku: "SAMS-GA54-001",
    quantity: 3,
    unitPrice: 950,
    totalValue: 2850,
    previousStock: 28,
    newStock: 25,
    location: "Sucursal Miraflores",
    reference: "VE-2024-001",
    responsible: "María González"
  },
  {
    id: 3,
    date: "2024-01-14",
    type: "Transferencia",
    product: "Camisa Polo Lacoste Azul",
    sku: "LAC-POL-AZ-001",
    quantity: 10,
    unitPrice: 120,
    totalValue: 1200,
    previousStock: 50,
    newStock: 40,
    location: "Almacén Norte → Sucursal Norte",
    reference: "TR-2024-001",
    responsible: "Ana García"
  },
  {
    id: 4,
    date: "2024-01-14",
    type: "Salida",
    product: "Mesa de Comedor Roble 6 puestos",
    sku: "MUE-MES-001",
    quantity: 1,
    unitPrice: 600,
    totalValue: 600,
    previousStock: 4,
    newStock: 3,
    location: "Almacén Central - Sección B",
    reference: "VE-2024-002",
    responsible: "Luis Mendoza"
  },
  {
    id: 5,
    date: "2024-01-13",
    type: "Entrada",
    product: "Zapatillas Nike Air Max",
    sku: "NIKE-AM-001",
    quantity: 25,
    unitPrice: 220,
    totalValue: 5500,
    previousStock: 5,
    newStock: 30,
    location: "Almacén Sur - Sección A",
    reference: "PO-2024-002",
    responsible: "Rosa Mendoza"
  }
];

const salesData: Sale[] = [
  {
    id: 1,
    date: "2024-01-15",
    customer: "Juan Pérez",
    products: [
      { name: "Laptop HP ProBook 450 G9", sku: "HP-PB450-001", quantity: 1, unitPrice: 2899, total: 2899 },
      { name: "Mouse Logitech", sku: "LOG-M001", quantity: 1, unitPrice: 89, total: 89 }
    ],
    subtotal: 2988,
    tax: 538.44,
    total: 3526.44,
    status: "Completada",
    paymentMethod: "Tarjeta de Crédito",
    branch: "Sucursal Central Lima",
    salesperson: "María González"
  },
  {
    id: 2,
    date: "2024-01-15",
    customer: "Ana Torres",
    products: [
      { name: "Smartphone Samsung Galaxy A54", sku: "SAMS-GA54-001", quantity: 2, unitPrice: 1299, total: 2598 }
    ],
    subtotal: 2598,
    tax: 467.64,
    total: 3065.64,
    status: "Completada",
    paymentMethod: "Efectivo",
    branch: "Sucursal Miraflores",
    salesperson: "Carlos Ruiz"
  },
  {
    id: 3,
    date: "2024-01-14",
    customer: "Empresa XYZ SAC",
    products: [
      { name: "Camisa Polo Lacoste Azul", sku: "LAC-POL-AZ-001", quantity: 15, unitPrice: 189, total: 2835 }
    ],
    subtotal: 2835,
    tax: 510.30,
    total: 3345.30,
    status: "Completada",
    paymentMethod: "Transferencia",
    branch: "Sucursal Norte",
    salesperson: "Ana Delgado"
  }
];

const salesChartData = [
  { date: "01 Ene", ventas: 2500, cantidad: 5 },
  { date: "02 Ene", ventas: 3200, cantidad: 8 },
  { date: "03 Ene", ventas: 2800, cantidad: 6 },
  { date: "04 Ene", ventas: 4100, cantidad: 12 },
  { date: "05 Ene", ventas: 3600, cantidad: 9 },
  { date: "06 Ene", ventas: 4500, cantidad: 15 },
  { date: "07 Ene", ventas: 3900, cantidad: 11 },
];

const movementChartData = [
  { date: "10 Ene", entradas: 1200, salidas: 800 },
  { date: "11 Ene", entradas: 800, salidas: 1200 },
  { date: "12 Ene", entradas: 1500, salidas: 900 },
  { date: "13 Ene", entradas: 2000, salidas: 1100 },
  { date: "14 Ene", entradas: 900, salidas: 1400 },
  { date: "15 Ene", entradas: 1800, salidas: 1000 },
];

export function SalesKardex() {
  const [selectedTab, setSelectedTab] = useState("kardex");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isNewMovementOpen, setIsNewMovementOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);

  const filteredKardex = kardexData.filter(entry => {
    const matchesSearch = entry.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || entry.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const filteredSales = salesData.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.salesperson.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const totalMovements = kardexData.length;
  const totalEntries = kardexData.filter(k => k.type === "Entrada").length;
  const totalExits = kardexData.filter(k => k.type === "Salida").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Ventas y Kardex</h2>
          <p className="text-muted-foreground">Control de movimientos de inventario y registro de ventas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isNewMovementOpen} onOpenChange={setIsNewMovementOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
                <DialogDescription>
                  Registra una entrada, salida o transferencia de productos
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="movement-type">Tipo de Movimiento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrada">Entrada</SelectItem>
                        <SelectItem value="Salida">Salida</SelectItem>
                        <SelectItem value="Transferencia">Transferencia</SelectItem>
                        <SelectItem value="Ajuste">Ajuste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="movement-date">Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Selecciona fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-select">Producto</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona producto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HP-PB450-001">Laptop HP ProBook 450 G9</SelectItem>
                        <SelectItem value="SAMS-GA54-001">Smartphone Samsung Galaxy A54</SelectItem>
                        <SelectItem value="LAC-POL-AZ-001">Camisa Polo Lacoste Azul</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location-select">Ubicación</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Almacén Central</SelectItem>
                        <SelectItem value="norte">Almacén Norte</SelectItem>
                        <SelectItem value="sur">Almacén Sur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="unit-price">Precio Unitario</Label>
                    <Input id="unit-price" type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reference">Referencia</Label>
                  <Input id="reference" placeholder="Número de orden, factura, etc." />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notas (Opcional)</Label>
                  <Input id="notes" placeholder="Observaciones adicionales" />
                </div>
                
                <Button type="submit" className="w-full">Registrar Movimiento</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Venta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Venta</DialogTitle>
                <DialogDescription>
                  Crea una nueva venta y actualiza automáticamente el inventario
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sale-customer">Cliente</Label>
                    <Input id="sale-customer" placeholder="Nombre del cliente" />
                  </div>
                  <div>
                    <Label htmlFor="sale-branch">Sucursal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Sucursal Central Lima</SelectItem>
                        <SelectItem value="miraflores">Sucursal Miraflores</SelectItem>
                        <SelectItem value="norte">Sucursal Norte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sale-method">Método de Pago</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Productos</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-12 gap-2 font-medium text-sm">
                      <div className="col-span-5">Producto</div>
                      <div className="col-span-2">Cantidad</div>
                      <div className="col-span-2">Precio Unit.</div>
                      <div className="col-span-2">Total</div>
                      <div className="col-span-1">Acciones</div>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona producto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HP-PB450-001">Laptop HP ProBook 450 G9 - S/ 2,899</SelectItem>
                            <SelectItem value="SAMS-GA54-001">Samsung Galaxy A54 - S/ 1,299</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Input type="number" placeholder="1" min="1" />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" step="0.01" placeholder="0.00" />
                      </div>
                      <div className="col-span-2">
                        <div className="font-medium">S/ 0.00</div>
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="sm" className="text-destructive">
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-end space-x-8">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Subtotal:</p>
                      <p className="font-medium">S/ 0.00</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">IGV (18%):</p>
                      <p className="font-medium">S/ 0.00</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total:</p>
                      <p className="text-xl font-bold">S/ 0.00</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" className="flex-1">Guardar Borrador</Button>
                  <Button type="submit" className="flex-1">Completar Venta</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movimientos</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovements}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">Movimientos de entrada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalExits}</div>
            <p className="text-xs text-muted-foreground">Movimientos de salida</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Ventas</CardTitle>
            <CardDescription>Ventas diarias del mes actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [name === "ventas" ? `S/ ${value}` : value, name === "ventas" ? "Ventas" : "Cantidad"]} />
                <Area type="monotone" dataKey="ventas" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimientos de Inventario</CardTitle>
            <CardDescription>Entradas vs Salidas por día</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={movementChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entradas" fill="#00C49F" />
                <Bar dataKey="salidas" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kardex" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Kardex de Inventario</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Registro de Ventas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kardex" className="space-y-4">
          {/* Kardex Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por producto, SKU o referencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los movimientos</SelectItem>
                <SelectItem value="Entrada">Entradas</SelectItem>
                <SelectItem value="Salida">Salidas</SelectItem>
                <SelectItem value="Transferencia">Transferencias</SelectItem>
                <SelectItem value="Ajuste">Ajustes</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-32">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Desde
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-32">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Hasta
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Kardex Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio Unit.</TableHead>
                    <TableHead>Stock Anterior</TableHead>
                    <TableHead>Stock Nuevo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Responsable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKardex.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            entry.type === "Entrada" ? "default" :
                            entry.type === "Salida" ? "destructive" :
                            entry.type === "Transferencia" ? "secondary" : "outline"
                          }
                        >
                          {entry.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{entry.product}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.sku}</TableCell>
                      <TableCell className="text-center">{entry.quantity}</TableCell>
                      <TableCell>S/ {entry.unitPrice}</TableCell>
                      <TableCell className="text-center">{entry.previousStock}</TableCell>
                      <TableCell className="text-center font-medium">{entry.newStock}</TableCell>
                      <TableCell className="text-sm">{entry.location}</TableCell>
                      <TableCell className="text-sm">{entry.reference}</TableCell>
                      <TableCell className="text-sm">{entry.responsible}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          {/* Sales Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, sucursal o vendedor..."
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
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Completada">Completadas</SelectItem>
                <SelectItem value="Pendiente">Pendientes</SelectItem>
                <SelectItem value="Cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sales Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>IGV</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Método Pago</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Vendedor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{format(new Date(sale.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="font-medium">{sale.customer}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {sale.products.slice(0, 2).map((product, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{product.name}</span>
                              <span className="text-muted-foreground"> × {product.quantity}</span>
                            </div>
                          ))}
                          {sale.products.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{sale.products.length - 2} más
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>S/ {sale.subtotal.toLocaleString()}</TableCell>
                      <TableCell>S/ {sale.tax.toLocaleString()}</TableCell>
                      <TableCell className="font-bold">S/ {sale.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            sale.status === "Completada" ? "default" :
                            sale.status === "Pendiente" ? "secondary" : "destructive"
                          }
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{sale.paymentMethod}</TableCell>
                      <TableCell className="text-sm">{sale.branch}</TableCell>
                      <TableCell className="text-sm">{sale.salesperson}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}