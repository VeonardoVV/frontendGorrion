import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { 
  User, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Package,
  Truck,
  Star,
  MessageSquare,
  Download,
  Edit,
  Plus,
  Eye,
  Search,
  Filter,
  Heart,
  Bell,
  Settings
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  status: "Activo" | "Inactivo" | "VIP";
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: string;
  preferredCategories: string[];
  loyaltyPoints: number;
  discountLevel: number;
}

interface ClientOrder {
  id: number;
  clientId: number;
  date: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "Pendiente" | "Procesando" | "Enviado" | "Entregado" | "Cancelado";
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface ClientSupport {
  id: number;
  clientId: number;
  subject: string;
  message: string;
  status: "Abierto" | "En Proceso" | "Resuelto" | "Cerrado";
  priority: "Baja" | "Media" | "Alta";
  createdDate: string;
  assignedTo?: string;
  responses: Array<{
    author: string;
    message: string;
    timestamp: string;
    isClient: boolean;
  }>;
}

const clients: Client[] = [
  {
    id: 1,
    name: "Juan Pérez González",
    email: "juan.perez@email.com",
    phone: "+51 999 123 456",
    address: "Av. Primavera 123, Surco, Lima",
    registrationDate: "2023-06-15",
    status: "VIP",
    totalPurchases: 15,
    totalSpent: 45230,
    lastPurchase: "2024-01-15",
    preferredCategories: ["Electrónicos", "Hogar"],
    loyaltyPoints: 2300,
    discountLevel: 15
  },
  {
    id: 2,
    name: "María González López",
    email: "maria.gonzalez@email.com",
    phone: "+51 998 765 432",
    address: "Jr. Los Olivos 456, Miraflores, Lima",
    registrationDate: "2023-03-22",
    status: "Activo",
    totalPurchases: 8,
    totalSpent: 18640,
    lastPurchase: "2024-01-10",
    preferredCategories: ["Ropa", "Accesorios"],
    loyaltyPoints: 890,
    discountLevel: 5
  },
  {
    id: 3,
    name: "Carlos Mendoza Ruiz",
    email: "carlos.mendoza@email.com",
    phone: "+51 997 555 123",
    address: "Av. Javier Prado 789, San Isidro, Lima",
    registrationDate: "2023-08-10",
    status: "Activo",
    totalPurchases: 12,
    totalSpent: 32150,
    lastPurchase: "2024-01-12",
    preferredCategories: ["Deportes", "Electrónicos"],
    loyaltyPoints: 1560,
    discountLevel: 10
  },
  {
    id: 4,
    name: "Ana Torres Silva",
    email: "ana.torres@email.com",
    phone: "+51 996 444 789",
    address: "Calle Las Flores 321, Barranco, Lima",
    registrationDate: "2023-11-05",
    status: "Activo",
    totalPurchases: 3,
    totalSpent: 5670,
    lastPurchase: "2024-01-08",
    preferredCategories: ["Hogar", "Decoración"],
    loyaltyPoints: 280,
    discountLevel: 0
  }
];

const clientOrders: ClientOrder[] = [
  {
    id: 1,
    clientId: 1,
    date: "2024-01-15",
    products: [
      { name: "Laptop HP ProBook 450 G9", quantity: 1, price: 2899 },
      { name: "Mouse Logitech", quantity: 1, price: 89 }
    ],
    total: 3526.44,
    status: "Entregado",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-18"
  },
  {
    id: 2,
    clientId: 2,
    date: "2024-01-10",
    products: [
      { name: "Camisa Polo Lacoste", quantity: 2, price: 189 }
    ],
    total: 445.64,
    status: "Enviado",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-16"
  },
  {
    id: 3,
    clientId: 1,
    date: "2024-01-05",
    products: [
      { name: "Smartphone Samsung Galaxy A54", quantity: 1, price: 1299 }
    ],
    total: 1532.82,
    status: "Entregado",
    trackingNumber: "TRK456789123"
  }
];

const supportTickets: ClientSupport[] = [
  {
    id: 1,
    clientId: 1,
    subject: "Problema con el producto recibido",
    message: "El producto llegó con un defecto en la pantalla",
    status: "En Proceso",
    priority: "Alta",
    createdDate: "2024-01-16",
    assignedTo: "Carlos Rodríguez",
    responses: [
      {
        author: "Juan Pérez González",
        message: "El producto llegó con un defecto en la pantalla. ¿Pueden ayudarme con el cambio?",
        timestamp: "2024-01-16T10:30:00",
        isClient: true
      },
      {
        author: "Carlos Rodríguez",
        message: "Lamentamos el inconveniente. Procederemos con el cambio inmediato. ¿Podría enviarnos fotos del defecto?",
        timestamp: "2024-01-16T11:15:00",
        isClient: false
      }
    ]
  },
  {
    id: 2,
    clientId: 2,
    subject: "Consulta sobre descuentos",
    message: "¿Cuándo aplicarán descuentos en ropa?",
    status: "Resuelto",
    priority: "Baja",
    createdDate: "2024-01-14",
    assignedTo: "Ana García",
    responses: [
      {
        author: "María González López",
        message: "¿Cuándo aplicarán descuentos en ropa? Estoy interesada en comprar varias prendas.",
        timestamp: "2024-01-14T14:20:00",
        isClient: true
      },
      {
        author: "Ana García",
        message: "Tenemos descuentos programados para el próximo fin de semana. Le enviaremos un email con los detalles.",
        timestamp: "2024-01-14T15:45:00",
        isClient: false
      }
    ]
  }
];

export function ClientPanel() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isClientDetailOpen, setIsClientDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ClientSupport | null>(null);
  const [newTicketResponse, setNewTicketResponse] = useState("");

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalClients = clients.length;
  const vipClients = clients.filter(c => c.status === "VIP").length;
  const activeClients = clients.filter(c => c.status === "Activo").length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);

  const getClientOrders = (clientId: number) => {
    return clientOrders.filter(order => order.clientId === clientId);
  };

  const getClientTickets = (clientId: number) => {
    return supportTickets.filter(ticket => ticket.clientId === clientId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "default";
      case "Activo": return "secondary";
      case "Inactivo": return "outline";
      default: return "outline";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Entregado": return "default";
      case "Enviado": return "secondary";
      case "Procesando": return "outline";
      case "Pendiente": return "secondary";
      case "Cancelado": return "destructive";
      default: return "outline";
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case "Resuelto": return "default";
      case "En Proceso": return "secondary";
      case "Abierto": return "outline";
      case "Cerrado": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "destructive";
      case "Media": return "secondary";
      case "Baja": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Panel de Clientes</h2>
          <p className="text-muted-foreground">Gestión de clientes, pedidos y soporte</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {activeClients} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipClients}</div>
            <p className="text-xs text-muted-foreground">
              {((vipClients / totalClients) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Promedio: S/ {Math.round(totalRevenue / totalClients).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Activos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportTickets.filter(t => t.status !== "Resuelto" && t.status !== "Cerrado").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Pedidos</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Soporte</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-6">
          {/* Clients Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar clientes por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Activo">Activos</SelectItem>
                <SelectItem value="Inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clients Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total Compras</TableHead>
                    <TableHead>Gasto Total</TableHead>
                    <TableHead>Puntos</TableHead>
                    <TableHead>Última Compra</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                        {client.status === "VIP" && (
                          <Badge variant="outline" className="ml-2">
                            {client.discountLevel}% desc
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{client.totalPurchases}</TableCell>
                      <TableCell className="font-medium">S/ {client.totalSpent.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{client.loyaltyPoints}</span>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(client.lastPurchase), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedClient(client);
                              setIsClientDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
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

        <TabsContent value="orders" className="space-y-6">
          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
              <CardDescription>Todos los pedidos realizados por los clientes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido #</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Seguimiento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientOrders.map((order) => {
                    const client = clients.find(c => c.id === order.clientId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{client?.name}</TableCell>
                        <TableCell>{format(new Date(order.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.products.slice(0, 2).map((product, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{product.name}</span>
                                <span className="text-muted-foreground"> × {product.quantity}</span>
                              </div>
                            ))}
                            {order.products.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{order.products.length - 2} más
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">S/ {order.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.trackingNumber && (
                            <div className="text-sm">
                              <p className="font-mono">{order.trackingNumber}</p>
                              {order.estimatedDelivery && (
                                <p className="text-muted-foreground">
                                  Est: {format(new Date(order.estimatedDelivery), "dd/MM")}
                                </p>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Truck className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="support" className="space-y-6">
          {/* Support Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets de Soporte</CardTitle>
              <CardDescription>Consultas y problemas reportados por los clientes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket #</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Asignado a</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => {
                    const client = clients.find(c => c.id === ticket.clientId);
                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">#{ticket.id}</TableCell>
                        <TableCell>{client?.name}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge variant={getTicketStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(ticket.createdDate), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-sm">{ticket.assignedTo || "Sin asignar"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Detail Modal */}
      {selectedClient && (
        <Dialog open={isClientDetailOpen} onOpenChange={setIsClientDetailOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <span>{selectedClient.name}</span>
                  <Badge variant={getStatusColor(selectedClient.status)} className="ml-3">
                    {selectedClient.status}
                  </Badge>
                </div>
              </DialogTitle>
              <DialogDescription>
                Cliente desde {format(new Date(selectedClient.registrationDate), "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Client Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información Personal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{selectedClient.address}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Compras:</span>
                      <span className="font-medium">{selectedClient.totalPurchases}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gasto Total:</span>
                      <span className="font-medium">S/ {selectedClient.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Puntos:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{selectedClient.loyaltyPoints}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Descuento:</span>
                      <span className="font-medium">{selectedClient.discountLevel}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Categorías Preferidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.preferredCategories.map((category, index) => (
                        <Badge key={index} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders History */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Historial de Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getClientOrders(selectedClient.id).map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Pedido #{order.id}</span>
                              <Badge variant={getOrderStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(order.date), "dd/MM/yyyy")}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            {order.products.map((product, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{product.name} × {product.quantity}</span>
                                <span>S/ {(product.price * product.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-sm text-muted-foreground">
                              {order.trackingNumber && (
                                <span>Seguimiento: {order.trackingNumber}</span>
                              )}
                            </div>
                            <span className="font-bold">Total: S/ {order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tickets de Soporte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getClientTickets(selectedClient.id).map((ticket) => (
                        <div key={ticket.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">#{ticket.id}</span>
                              <Badge variant={getTicketStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                              <Badge variant={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(ticket.createdDate), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-1">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground">{ticket.message}</p>
                          {ticket.assignedTo && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Asignado a: {ticket.assignedTo}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Editar Cliente
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Mensaje
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Agregar Puntos
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Support Ticket Detail Modal */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ticket #{selectedTicket.id}: {selectedTicket.subject}</DialogTitle>
              <DialogDescription>
                Cliente: {clients.find(c => c.id === selectedTicket.clientId)?.name} - 
                Creado el {format(new Date(selectedTicket.createdDate), "dd/MM/yyyy")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Badge variant={getTicketStatusColor(selectedTicket.status)}>
                  {selectedTicket.status}
                </Badge>
                <Badge variant={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority}
                </Badge>
                {selectedTicket.assignedTo && (
                  <span className="text-sm text-muted-foreground">
                    Asignado a: {selectedTicket.assignedTo}
                  </span>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Conversación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedTicket.responses.map((response, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        response.isClient ? "bg-muted ml-8" : "bg-primary/10 mr-8"
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{response.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(response.timestamp), "dd/MM HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Responder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Escribe tu respuesta..."
                      value={newTicketResponse}
                      onChange={(e) => setNewTicketResponse(e.target.value)}
                      className="min-h-20"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Select>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Abierto">Abierto</SelectItem>
                            <SelectItem value="En Proceso">En Proceso</SelectItem>
                            <SelectItem value="Resuelto">Resuelto</SelectItem>
                            <SelectItem value="Cerrado">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button disabled={!newTicketResponse.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Respuesta
                      </Button>
                    </div>
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