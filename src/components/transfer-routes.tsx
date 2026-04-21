import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { 
  Route, 
  Plus, 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Eye,
  Edit,
  Search,
  Filter,
  ArrowRight,
  Calendar,
  User,
  FileText,
  Scan,
  RotateCcw,
  ClipboardCheck,
  AlertTriangle,
  Minus,
  PackageCheck,
  PackageX
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TransferRequest {
  id: number;
  requestNumber: string;
  originWarehouse: string;
  destinationWarehouse: string;
  products: Array<{
    id: number;
    name: string;
    sku: string;
    requestedQuantity: number;
    approvedQuantity?: number;
    receivedQuantity?: number;
    unitCost: number;
    category: string;
    verificationStatus?: "Conforme" | "Faltante" | "Dañado" | "Diferencia";
    verificationNotes?: string;
    verifiedBy?: string;
    verificationDate?: string;
  }>;
  requestedBy: string;
  requestDate: string;
  approvedBy?: string;
  approvalDate?: string;
  status: "Pendiente" | "Aprobado" | "En Tránsito" | "Recibido" | "Parcialmente Recibido" | "Rechazado" | "Verificando";
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  reason: string;
  notes?: string;
  trackingNumber?: string;
  estimatedArrival?: string;
  actualArrival?: string;
  transportMethod: "Interno" | "Tercerizado" | "Cliente Retira";
  transportCost?: number;
  receivedBy?: string;
  receptionNotes?: string;
  route?: Array<{
    location: string;
    timestamp: string;
    status: "Completado" | "En Proceso";
    notes?: string;
  }>;
}

interface TransferApproval {
  transferId: number;
  reviewedBy: string;
  reviewDate: string;
  decision: "approved" | "rejected" | "partial";
  reviewNotes: string;
  productAdjustments?: Array<{
    productId: number;
    originalQuantity: number;
    approvedQuantity: number;
    reason: string;
  }>;
}

const transferRequests: TransferRequest[] = [
  {
    id: 1,
    requestNumber: "TR-2024-001",
    originWarehouse: "Almacén Central",
    destinationWarehouse: "Almacén Norte",
    products: [
      {
        id: 1,
        name: "Laptop HP ProBook 450 G9",
        sku: "HP-PB450-001",
        requestedQuantity: 5,
        approvedQuantity: 4,
        receivedQuantity: 3,
        unitCost: 2200,
        category: "Electrónicos",
        verificationStatus: "Faltante",
        verificationNotes: "Falta 1 unidad - revisar con transporte",
        verifiedBy: "Luis Mendoza",
        verificationDate: "2024-01-16T10:15:00"
      },
      {
        id: 2,
        name: "Mouse Logitech MX",
        sku: "LOG-MX-001",
        requestedQuantity: 10,
        approvedQuantity: 10,
        receivedQuantity: 10,
        unitCost: 89,
        category: "Accesorios",
        verificationStatus: "Conforme",
        verificationNotes: "Productos en perfecto estado",
        verifiedBy: "Luis Mendoza",
        verificationDate: "2024-01-16T10:15:00"
      }
    ],
    requestedBy: "Ana García",
    requestDate: "2024-01-15T10:30:00",
    approvedBy: "Carlos Rodríguez",
    approvalDate: "2024-01-15T14:15:00",
    status: "Parcialmente Recibido",
    priority: "Alta",
    reason: "Reposición de stock por alta demanda en sucursal norte",
    notes: "Productos necesarios para cubrir ventas del fin de semana",
    trackingNumber: "TRK-TR-001-2024",
    estimatedArrival: "2024-01-16T10:00:00",
    actualArrival: "2024-01-16T10:15:00",
    transportMethod: "Interno",
    receivedBy: "Luis Mendoza",
    receptionNotes: "Recepción con observaciones - falta 1 laptop",
    route: [
      {
        location: "Almacén Central - Despacho",
        timestamp: "2024-01-15T15:30:00",
        status: "Completado",
        notes: "Productos empacados y verificados"
      },
      {
        location: "En ruta - Km 45",
        timestamp: "2024-01-15T17:45:00",
        status: "Completado",
        notes: "Tránsito normal"
      },
      {
        location: "Almacén Norte - Recepción",
        timestamp: "2024-01-16T10:15:00",
        status: "Completado",
        notes: "Recibido con observaciones"
      }
    ]
  },
  {
    id: 2,
    requestNumber: "TR-2024-002",
    originWarehouse: "Almacén Central",
    destinationWarehouse: "Almacén Sur",
    products: [
      {
        id: 3,
        name: "Smartphone Samsung Galaxy A54",
        sku: "SAMS-GA54-001",
        requestedQuantity: 8,
        approvedQuantity: 8,
        unitCost: 950,
        category: "Electrónicos"
      },
      {
        id: 6,
        name: "Cargador USB-C",
        sku: "CHAR-USBC-001",
        requestedQuantity: 15,
        approvedQuantity: 15,
        unitCost: 25,
        category: "Accesorios"
      }
    ],
    requestedBy: "Luis Mendoza",
    requestDate: "2024-01-15T08:45:00",
    approvedBy: "Carlos Rodríguez",
    approvalDate: "2024-01-15T16:30:00",
    status: "Verificando",
    priority: "Media",
    reason: "Transferencia programada mensual",
    trackingNumber: "TRK-TR-002-2024",
    actualArrival: "2024-01-16T08:30:00",
    transportMethod: "Tercerizado",
    receivedBy: "Rosa Mendoza"
  },
  {
    id: 3,
    requestNumber: "TR-2024-003",
    originWarehouse: "Almacén Norte",
    destinationWarehouse: "Almacén Central",
    products: [
      {
        id: 4,
        name: "Mesa de Comedor Roble",
        sku: "MUE-MES-001",
        requestedQuantity: 2,
        approvedQuantity: 1,
        unitCost: 600,
        category: "Hogar"
      }
    ],
    requestedBy: "María González",
    requestDate: "2024-01-14T16:20:00",
    approvedBy: "Carlos Rodríguez",
    approvalDate: "2024-01-15T09:30:00",
    status: "Parcial",
    priority: "Baja",
    reason: "Redistribución de inventario",
    notes: "Solo se aprobó 1 unidad por stock limitado",
    transportMethod: "Interno"
  },
  {
    id: 4,
    requestNumber: "TR-2024-004",
    originWarehouse: "Almacén Central",
    destinationWarehouse: "Sucursal Miraflores",
    products: [
      {
        id: 5,
        name: "Camisa Polo Lacoste",
        sku: "LAC-POL-001",
        requestedQuantity: 20,
        unitCost: 120,
        category: "Ropa"
      }
    ],
    requestedBy: "Rosa Delgado",
    requestDate: "2024-01-14T11:15:00",
    approvedBy: "María González",
    approvalDate: "2024-01-14T13:45:00",
    status: "Recibido",
    priority: "Alta",
    reason: "Stock agotado en sucursal",
    trackingNumber: "TRK-TR-004-2024",
    actualArrival: "2024-01-15T10:30:00",
    transportMethod: "Interno"
  }
];

export function TransferRoutes() {
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateTransferOpen, setIsCreateTransferOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("requests");
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    id: number;
    name: string;
    sku: string;
    quantity: number;
    unitCost: number;
    category: string;
  }>>([]);

  const filteredTransfers = transferRequests.filter(transfer => {
    const matchesSearch = transfer.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.originWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.destinationWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || transfer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const pendingApprovals = transferRequests.filter(t => t.status === "Pendiente").length;
  const inTransit = transferRequests.filter(t => t.status === "En Tránsito").length;
  const pendingVerification = transferRequests.filter(t => t.status === "Verificando").length;
  const totalRequests = transferRequests.length;
  const completedToday = transferRequests.filter(t => 
    (t.status === "Recibido" || t.status === "Parcialmente Recibido") && 
    t.actualArrival && 
    new Date(t.actualArrival).toDateString() === new Date().toDateString()
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente": return "secondary";
      case "Aprobado": return "outline";
      case "En Tránsito": return "default";
      case "Recibido": return "default";
      case "Parcialmente Recibido": return "secondary";
      case "Verificando": return "outline";
      case "Rechazado": return "destructive";
      case "Parcial": return "secondary";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgente": return "destructive";
      case "Alta": return "secondary";
      case "Media": return "outline";
      case "Baja": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pendiente": return Clock;
      case "Aprobado": return CheckCircle2;
      case "En Tránsito": return Truck;
      case "Recibido": return PackageCheck;
      case "Parcialmente Recibido": return PackageX;
      case "Verificando": return ClipboardCheck;
      case "Rechazado": return XCircle;
      case "Parcial": return AlertCircle;
      default: return Clock;
    }
  };

  const handleCreateTransfer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // En una implementación real, aquí se crearía la solicitud
    setIsCreateTransferOpen(false);
  };

  const handleApproval = (transferId: number, decision: "approved" | "rejected" | "partial") => {
    // En una implementación real, aquí se procesaría la aprobación
    setIsApprovalModalOpen(false);
    setSelectedTransfer(null);
  };

  const addProductToTransfer = (product: any) => {
    setSelectedProducts([...selectedProducts, {
      id: product.id,
      name: product.name,
      sku: product.sku,
      quantity: 1,
      unitCost: product.unitCost,
      category: product.category
    }]);
  };

  const updateProductQuantity = (index: number, quantity: number) => {
    const updated = [...selectedProducts];
    updated[index].quantity = quantity;
    setSelectedProducts(updated);
  };

  const removeProduct = (index: number) => {
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
  };

  const handleVerification = (transferId: number) => {
    // En una implementación real, aquí se procesaría la verificación
    setIsVerificationModalOpen(false);
    setSelectedTransfer(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Traslados y Rutas</h2>
          <p className="text-muted-foreground">Gestión de traslados entre almacenes con seguimiento y aprobaciones</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Scan className="h-4 w-4 mr-2" />
            Escanear QR
          </Button>
          <Dialog open={isCreateTransferOpen} onOpenChange={setIsCreateTransferOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Solicitud
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nueva Solicitud de Traslado</DialogTitle>
                <DialogDescription>
                  Crea una nueva solicitud de traslado entre almacenes
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTransfer} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="origin">Almacén Origen</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona origen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Almacén Central</SelectItem>
                        <SelectItem value="norte">Almacén Norte</SelectItem>
                        <SelectItem value="sur">Almacén Sur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="destination">Almacén Destino</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Almacén Central</SelectItem>
                        <SelectItem value="norte">Almacén Norte</SelectItem>
                        <SelectItem value="sur">Almacén Sur</SelectItem>
                        <SelectItem value="miraflores">Sucursal Miraflores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transport">Método de Transporte</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Interno">Transporte Interno</SelectItem>
                        <SelectItem value="Tercerizado">Tercerizado</SelectItem>
                        <SelectItem value="Cliente Retira">Cliente Retira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimated">Fecha Estimada</Label>
                    <Input type="datetime-local" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Motivo del Traslado</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="Describe la razón del traslado..."
                    required 
                  />
                </div>

                <div>
                  <Label>Productos a Trasladar</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-3 font-semibold text-sm bg-gradient-to-r from-muted/50 to-muted/30 p-3 rounded-lg border border-border/30">
                      <div className="col-span-5 flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        Producto
                      </div>
                      <div className="col-span-2 text-center">Cantidad</div>
                      <div className="col-span-2 text-center">Stock Actual</div>
                      <div className="col-span-2 text-center">Costo Unit.</div>
                      <div className="col-span-1 text-center">Acciones</div>
                    </div>
                    
                    {/* Productos seleccionados */}
                    {selectedProducts.length > 0 && (
                      <div className="space-y-2">
                        {selectedProducts.map((product, index) => (
                          <div key={index} className="grid grid-cols-12 gap-3 items-center p-4 bg-gradient-to-r from-background to-muted/20 border border-border/50 rounded-lg hover:shadow-sm transition-all">
                            <div className="col-span-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-chart-1/20 flex items-center justify-center border border-chart-1/30">
                                  <Package className="h-5 w-5 text-chart-1" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-foreground truncate">{product.name}</p>
                                  <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
                                  <Badge variant="outline" className="text-xs mt-1">{product.category}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => updateProductQuantity(index, parseInt(e.target.value) || 0)}
                                min="1"
                                className="text-center font-semibold bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                              />
                            </div>
                            <div className="col-span-2 text-center">
                              <Badge variant="secondary" className="px-3 py-1 font-semibold">15</Badge>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                                S/ {product.unitCost.toLocaleString()}
                              </span>
                            </div>
                            <div className="col-span-1 text-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeProduct(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Total */}
                        <div className="grid grid-cols-12 gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 font-semibold">
                          <div className="col-span-5 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-foreground">Total de productos:</span>
                          </div>
                          <div className="col-span-2 text-center">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-chart-2/20 border border-chart-2/30">
                              <span className="text-lg font-bold text-chart-2">
                                {selectedProducts.reduce((sum, p) => sum + p.quantity, 0)}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-2"></div>
                          <div className="col-span-2 text-center">
                            <span className="text-xl font-bold text-primary">
                              S/ {selectedProducts.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="col-span-1"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Selector de productos */}
                    <div className="border-t pt-3">
                      <Label className="text-sm text-muted-foreground">Agregar producto:</Label>
                      <div className="grid grid-cols-12 gap-2 items-center mt-2">
                        <div className="col-span-8">
                          <Select onValueChange={(value) => {
                            const availableProducts = [
                              { id: 1, name: "Laptop HP ProBook 450 G9", sku: "HP-PB450-001", unitCost: 2200, category: "Electrónicos" },
                              { id: 2, name: "Smartphone Samsung Galaxy A54", sku: "SAMS-GA54-001", unitCost: 950, category: "Electrónicos" },
                              { id: 3, name: "Mouse Logitech MX", sku: "LOG-MX-001", unitCost: 89, category: "Accesorios" },
                              { id: 4, name: "Teclado Mecánico", sku: "KEY-MEC-001", unitCost: 150, category: "Accesorios" },
                              { id: 5, name: "Monitor Dell 24\"", sku: "MON-DELL-24", unitCost: 450, category: "Electrónicos" }
                            ];
                            const product = availableProducts.find(p => p.sku === value);
                            if (product && !selectedProducts.find(p => p.id === product.id)) {
                              addProductToTransfer(product);
                            }
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Buscar y seleccionar producto..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HP-PB450-001">Laptop HP ProBook 450 G9 - Stock: 15</SelectItem>
                              <SelectItem value="SAMS-GA54-001">Samsung Galaxy A54 - Stock: 25</SelectItem>
                              <SelectItem value="LOG-MX-001">Mouse Logitech MX - Stock: 50</SelectItem>
                              <SelectItem value="KEY-MEC-001">Teclado Mecánico - Stock: 30</SelectItem>
                              <SelectItem value="MON-DELL-24">Monitor Dell 24" - Stock: 12</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-4">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            disabled={selectedProducts.length === 0}
                          >
                            <Scan className="h-4 w-4 mr-2" />
                            Escanear Código
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedProducts.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No hay productos seleccionados</p>
                      <p className="text-sm">Selecciona productos para crear la guía de traslado</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Notas Adicionales</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Observaciones, instrucciones especiales, etc."
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Crear Solicitud
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    Guardar Borrador
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Pendientes de Aprobación</CardTitle>
            <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/20">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{pendingApprovals}</div>
            <p className="text-muted-foreground mt-1">
              Requieren revisión
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-orange-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>En Tránsito</CardTitle>
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
              <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inTransit}</div>
            <p className="text-muted-foreground mt-1">En movimiento</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Solicitudes</CardTitle>
            <div className="rounded-full bg-primary/10 p-2">
              <Route className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalRequests}</div>
            <p className="text-muted-foreground mt-1">Este mes</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 to-primary" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Pendientes Verificación</CardTitle>
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/20">
              <ClipboardCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingVerification}</div>
            <p className="text-muted-foreground mt-1">Necesitan verificación</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-amber-600" />
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 rounded-xl border border-border/50">
          <TabsTrigger 
            value="requests" 
            className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-lg transition-all"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Solicitudes</span>
            <span className="sm:hidden">Solicitudes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="approvals" 
            className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-lg transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">Aprobaciones</span>
            <span className="sm:hidden">Aprobaciones</span>
            {pendingApprovals > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {pendingApprovals}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="verification" 
            className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-lg transition-all"
          >
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Verificación</span>
            <span className="sm:hidden">Verificación</span>
            {pendingVerification > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-amber-500 text-white">
                {pendingVerification}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="tracking" 
            className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50 rounded-lg transition-all"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Seguimiento</span>
            <span className="sm:hidden">Seguimiento</span>
            {inTransit > 0 && (
              <Badge variant="outline" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center border-blue-500 text-blue-600">
                {inTransit}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por número, almacén, o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-background/50 border-border/50">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Aprobado">Aprobado</SelectItem>
                  <SelectItem value="En Tránsito">En Tránsito</SelectItem>
                  <SelectItem value="Recibido">Recibido</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="shrink-0">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Transfers Table */}
          <Card className="overflow-hidden border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-b border-border/50">
                    <TableHead className="font-semibold text-foreground">Solicitud</TableHead>
                    <TableHead className="font-semibold text-foreground">Ruta</TableHead>
                    <TableHead className="font-semibold text-foreground">Productos</TableHead>
                    <TableHead className="font-semibold text-foreground">Solicitante</TableHead>
                    <TableHead className="font-semibold text-foreground">Estado</TableHead>
                    <TableHead className="font-semibold text-foreground">Prioridad</TableHead>
                    <TableHead className="font-semibold text-foreground">Fecha</TableHead>
                    <TableHead className="font-semibold text-foreground">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => {
                    const StatusIcon = getStatusIcon(transfer.status);
                    return (
                      <TableRow key={transfer.id} className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/30">
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">{transfer.requestNumber}</p>
                            {transfer.trackingNumber && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 border border-border/30">
                                <span className="text-xs text-muted-foreground font-mono">
                                  {transfer.trackingNumber}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="rounded-full bg-primary/10 p-2">
                              <MapPin className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-foreground">{transfer.originWarehouse}</span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium text-foreground">{transfer.destinationWarehouse}</span>
                              </div>
                              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-xs">
                                <Truck className="h-3 w-3" />
                                {transfer.transportMethod}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            {transfer.products.slice(0, 2).map((product, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-chart-1" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground truncate">{product.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Qty: {product.requestedQuantity}</span>
                                    <Badge variant="outline" className="text-xs px-1 py-0">
                                      {product.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {transfer.products.length > 2 && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                                <Package className="h-3 w-3" />
                                +{transfer.products.length - 2} productos más
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{transfer.requestedBy}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(transfer.requestDate), "dd/MM/yyyy HH:mm")}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full p-1.5 ${
                              transfer.status === "Pendiente" ? "bg-orange-100 dark:bg-orange-900/20" :
                              transfer.status === "En Tránsito" ? "bg-blue-100 dark:bg-blue-900/20" :
                              transfer.status === "Verificando" ? "bg-amber-100 dark:bg-amber-900/20" :
                              transfer.status === "Recibido" ? "bg-green-100 dark:bg-green-900/20" :
                              transfer.status === "Parcialmente Recibido" ? "bg-yellow-100 dark:bg-yellow-900/20" :
                              "bg-red-100 dark:bg-red-900/20"
                            }`}>
                              <StatusIcon className={`h-3 w-3 ${
                                transfer.status === "Pendiente" ? "text-orange-600 dark:text-orange-400" :
                                transfer.status === "En Tránsito" ? "text-blue-600 dark:text-blue-400" :
                                transfer.status === "Verificando" ? "text-amber-600 dark:text-amber-400" :
                                transfer.status === "Recibido" ? "text-green-600 dark:text-green-400" :
                                transfer.status === "Parcialmente Recibido" ? "text-yellow-600 dark:text-yellow-400" :
                                "text-red-600 dark:text-red-400"
                              }`} />
                            </div>
                            <Badge variant={getStatusColor(transfer.status)} className="font-medium">
                              {transfer.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              transfer.priority === "Urgente" ? "bg-red-500 animate-pulse" :
                              transfer.priority === "Alta" ? "bg-orange-500" :
                              transfer.priority === "Media" ? "bg-yellow-500" :
                              "bg-green-500"
                            }`} />
                            <Badge variant={getPriorityColor(transfer.priority)} className="font-medium">
                              {transfer.priority}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-center">
                            <div className="font-medium text-foreground">
                              {format(new Date(transfer.requestDate), "dd/MM")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(transfer.requestDate), "yyyy")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTransfer(transfer)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {transfer.status === "Pendiente" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
                                  setIsApprovalModalOpen(true);
                                }}
                                className="hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            {transfer.status === "Verificando" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTransfer(transfer);
                                  setIsVerificationModalOpen(true);
                                }}
                                className="hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
                              >
                                <ClipboardCheck className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Pendientes de Aprobación</CardTitle>
              <CardDescription>
                Revisa y aprueba las solicitudes de traslado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transferRequests
                  .filter(t => t.status === "Pendiente")
                  .map((transfer) => (
                    <div key={transfer.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">{transfer.requestNumber}</Badge>
                          <Badge variant={getPriorityColor(transfer.priority)}>
                            {transfer.priority}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproval(transfer.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproval(transfer.id, "partial")}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Parcial
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproval(transfer.id, "approved")}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Aprobar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Ruta:</p>
                          <p className="font-medium">
                            {transfer.originWarehouse} → {transfer.destinationWarehouse}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Solicitado por:</p>
                          <p className="font-medium">{transfer.requestedBy}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-2">Productos:</p>
                        <div className="space-y-2">
                          {transfer.products.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.sku}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{product.requestedQuantity} unidades</p>
                                <p className="text-sm text-muted-foreground">
                                  S/ {(product.unitCost * product.requestedQuantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">Motivo:</p>
                        <p className="text-sm">{transfer.reason}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traslados Pendientes de Verificación</CardTitle>
              <CardDescription>
                Verifica los productos recibidos y registra cualquier observación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transferRequests
                  .filter(t => t.status === "Verificando")
                  .map((transfer) => (
                    <div key={transfer.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{transfer.requestNumber}</Badge>
                          <Badge variant={getPriorityColor(transfer.priority)}>
                            {transfer.priority}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {transfer.originWarehouse} → {transfer.destinationWarehouse}
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedTransfer(transfer);
                            setIsVerificationModalOpen(true);
                          }}
                        >
                          <ClipboardCheck className="h-4 w-4 mr-2" />
                          Verificar Productos
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Recibido por:</p>
                          <p className="font-medium">{transfer.receivedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha de llegada:</p>
                          <p className="font-medium">
                            {transfer.actualArrival && format(new Date(transfer.actualArrival), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-2">Productos a verificar:</p>
                        <div className="grid gap-2">
                          {transfer.products.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex-1">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.sku}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {product.approvedQuantity || product.requestedQuantity} unidades esperadas
                                </p>
                                <Badge variant="secondary">
                                  {product.category}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                
                {transferRequests.filter(t => t.status === "Verificando").length === 0 && (
                  <div className="text-center py-8">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No hay traslados por verificar</h3>
                    <p className="text-muted-foreground">
                      Todos los traslados han sido verificados
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seguimiento en Tiempo Real</CardTitle>
              <CardDescription>
                Monitorea el estado de los traslados en curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {transferRequests
                  .filter(t => t.status === "En Tránsito" && t.route)
                  .map((transfer) => (
                    <div key={transfer.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Truck className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{transfer.requestNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {transfer.originWarehouse} → {transfer.destinationWarehouse}
                            </p>
                          </div>
                        </div>
                        {transfer.trackingNumber && (
                          <Badge variant="outline" className="font-mono">
                            {transfer.trackingNumber}
                          </Badge>
                        )}
                      </div>

                      {transfer.route && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Ruta de Seguimiento</h4>
                            {transfer.estimatedArrival && (
                              <p className="text-sm text-muted-foreground">
                                Llegada estimada: {format(new Date(transfer.estimatedArrival), "dd/MM HH:mm")}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            {transfer.route.map((checkpoint, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className={`w-3 h-3 rounded-full mt-2 ${
                                  checkpoint.status === "Completado" 
                                    ? "bg-green-500" 
                                    : "bg-blue-500"
                                }`} />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium">{checkpoint.location}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {format(new Date(checkpoint.timestamp), "dd/MM HH:mm")}
                                    </p>
                                  </div>
                                  <Badge 
                                    variant={checkpoint.status === "Completado" ? "default" : "secondary"}
                                    className="mt-1"
                                  >
                                    {checkpoint.status}
                                  </Badge>
                                  {checkpoint.notes && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {checkpoint.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progreso del traslado</span>
                              <span>
                                {transfer.route.filter(r => r.status === "Completado").length} / {transfer.route.length}
                              </span>
                            </div>
                            <Progress 
                              value={(transfer.route.filter(r => r.status === "Completado").length / transfer.route.length) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transfer Detail Modal */}
      {selectedTransfer && !isApprovalModalOpen && (
        <Dialog open={!!selectedTransfer} onOpenChange={() => setSelectedTransfer(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <Package className="h-6 w-6" />
                <span>Solicitud {selectedTransfer.requestNumber}</span>
                <Badge variant={getStatusColor(selectedTransfer.status)}>
                  {selectedTransfer.status}
                </Badge>
                <Badge variant={getPriorityColor(selectedTransfer.priority)}>
                  {selectedTransfer.priority}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Detalles completos de la solicitud de traslado
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Origen</p>
                        <p className="font-medium">{selectedTransfer.originWarehouse}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Destino</p>
                        <p className="font-medium">{selectedTransfer.destinationWarehouse}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Solicitado por</p>
                        <p className="font-medium">{selectedTransfer.requestedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha Solicitud</p>
                        <p className="font-medium">
                          {format(new Date(selectedTransfer.requestDate), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                    {selectedTransfer.approvedBy && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Aprobado por</p>
                          <p className="font-medium">{selectedTransfer.approvedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha Aprobación</p>
                          <p className="font-medium">
                            {selectedTransfer.approvalDate && 
                              format(new Date(selectedTransfer.approvalDate), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Método de Transporte</p>
                      <p className="font-medium">{selectedTransfer.transportMethod}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Motivo y Observaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Motivo</p>
                      <p className="text-sm">{selectedTransfer.reason}</p>
                    </div>
                    {selectedTransfer.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Notas</p>
                        <p className="text-sm">{selectedTransfer.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Productos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedTransfer.products.map((product, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.sku}</p>
                            </div>
                            <Badge variant="outline">{product.category}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Cantidad Solicitada</p>
                              <p className="font-medium">{product.requestedQuantity}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Cantidad Aprobada</p>
                              <p className={`font-medium ${
                                product.approvedQuantity !== undefined
                                  ? product.approvedQuantity === product.requestedQuantity
                                    ? "text-green-600"
                                    : "text-orange-600"
                                  : ""
                              }`}>
                                {product.approvedQuantity ?? "Pendiente"}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                            <div>
                              <p className="text-muted-foreground">Costo Unitario</p>
                              <p className="font-medium">S/ {product.unitCost.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Valor Total</p>
                              <p className="font-medium">
                                S/ {((product.approvedQuantity || product.requestedQuantity) * product.unitCost).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedTransfer.trackingNumber && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Información de Envío</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Número de Seguimiento</p>
                        <p className="font-mono font-medium">{selectedTransfer.trackingNumber}</p>
                      </div>
                      {selectedTransfer.estimatedArrival && (
                        <div>
                          <p className="text-sm text-muted-foreground">Llegada Estimada</p>
                          <p className="font-medium">
                            {format(new Date(selectedTransfer.estimatedArrival), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      )}
                      {selectedTransfer.actualArrival && (
                        <div>
                          <p className="text-sm text-muted-foreground">Llegada Real</p>
                          <p className="font-medium text-green-600">
                            {format(new Date(selectedTransfer.actualArrival), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              {selectedTransfer.status === "En Tránsito" && (
                <Button variant="outline" className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Seguir Ruta
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Modal */}
      {selectedTransfer && isApprovalModalOpen && (
        <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Aprobar Solicitud {selectedTransfer.requestNumber}</DialogTitle>
              <DialogDescription>
                Revisa y aprueba la solicitud de traslado
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ruta:</p>
                  <p className="font-medium">
                    {selectedTransfer.originWarehouse} → {selectedTransfer.destinationWarehouse}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prioridad:</p>
                  <Badge variant={getPriorityColor(selectedTransfer.priority)}>
                    {selectedTransfer.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Productos a aprobar:</p>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Solicitado</TableHead>
                        <TableHead>Aprobar</TableHead>
                        <TableHead>Stock Actual</TableHead>
                        <TableHead>Observaciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTransfer.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {product.requestedQuantity}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              defaultValue={product.requestedQuantity}
                              min="0"
                              max={product.requestedQuantity}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">15</Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Motivo del ajuste..."
                              className="text-sm"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <Label htmlFor="approval-notes">Comentarios de Aprobación</Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Observaciones, condiciones especiales, etc."
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleApproval(selectedTransfer.id, "rejected")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar Solicitud
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleApproval(selectedTransfer.id, "partial")}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Aprobación Parcial
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleApproval(selectedTransfer.id, "approved")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aprobar Completo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Verification Modal */}
      {selectedTransfer && isVerificationModalOpen && (
        <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <ClipboardCheck className="h-6 w-6" />
                <span>Verificar Recepción - {selectedTransfer.requestNumber}</span>
                <Badge variant="outline">
                  {selectedTransfer.originWarehouse} → {selectedTransfer.destinationWarehouse}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Verifica cada producto recibido y registra observaciones si es necesario
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Información del traslado */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Información del Traslado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Recibido por</p>
                      <p className="font-medium">{selectedTransfer.receivedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de llegada</p>
                      <p className="font-medium">
                        {selectedTransfer.actualArrival && 
                          format(new Date(selectedTransfer.actualArrival), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Número de seguimiento</p>
                      <p className="font-mono font-medium">{selectedTransfer.trackingNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verificación de productos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Verificación de Productos</CardTitle>
                  <CardDescription>
                    Verifica cada producto y registra la cantidad real recibida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedTransfer.products.map((product, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Información del producto */}
                          <div>
                            <div className="flex items-center space-x-3 mb-3">
                              <Package className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.sku}</p>
                                <Badge variant="outline" className="mt-1">{product.category}</Badge>
                              </div>
                            </div>
                          </div>

                          {/* Cantidades */}
                          <div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm">Cantidad Esperada</Label>
                                <div className="p-2 bg-muted rounded text-center font-medium">
                                  {product.approvedQuantity || product.requestedQuantity}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm">Cantidad Recibida</Label>
                                <Input
                                  type="number"
                                  defaultValue={product.receivedQuantity || product.approvedQuantity || product.requestedQuantity}
                                  min="0"
                                  max={product.approvedQuantity || product.requestedQuantity}
                                  className="text-center"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Estado y observaciones */}
                          <div>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm">Estado de Verificación</Label>
                                <Select defaultValue={product.verificationStatus || "Conforme"}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Conforme">
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span>Conforme</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Faltante">
                                      <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                                        <span>Faltante</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Dañado">
                                      <div className="flex items-center space-x-2">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        <span>Dañado</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Diferencia">
                                      <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <span>Diferencia</span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-sm">Observaciones</Label>
                                <Textarea
                                  placeholder="Describe cualquier problema o observación..."
                                  defaultValue={product.verificationNotes}
                                  className="min-h-16"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Observaciones generales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Observaciones Generales de Recepción</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Observaciones generales sobre el estado del envío, embalaje, documentación, etc."
                    defaultValue={selectedTransfer.receptionNotes}
                    className="min-h-20"
                  />
                </CardContent>
              </Card>

              {/* Resumen de verificación */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumen de Verificación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-green-100 dark:bg-green-900/40 p-1.5">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Conformes</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {selectedTransfer.products.filter(p => p.verificationStatus === "Conforme").length}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-orange-100 dark:bg-orange-900/40 p-1.5">
                          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Faltantes</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {selectedTransfer.products.filter(p => p.verificationStatus === "Faltante").length}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-1.5">
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">Dañados</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {selectedTransfer.products.filter(p => p.verificationStatus === "Dañado").length}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/40 p-1.5">
                          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Diferencias</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {selectedTransfer.products.filter(p => p.verificationStatus === "Diferencia").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acciones */}
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsVerificationModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Guardar Borrador
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleVerification(selectedTransfer.id)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Finalizar Verificación
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}