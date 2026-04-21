import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Separator } from "./ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, Search, Package, CreditCard, MapPin, User, Clock, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
  category: string;
}

interface Order {
  id: number;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "Pendiente" | "Confirmado" | "Enviado" | "Entregado" | "Cancelado";
  paymentMethod: string;
  notes?: string;
}

const availableProducts = [
  {
    id: 1,
    name: "Laptop HP ProBook 450 G9",
    sku: "HP-PB450-001",
    price: 2899,
    stock: 15,
    category: "Electrónicos"
  },
  {
    id: 2,
    name: "Smartphone Samsung Galaxy A54",
    sku: "SAMS-GA54-001",
    price: 1299,
    stock: 25,
    category: "Electrónicos"
  },
  {
    id: 3,
    name: "Mesa de Comedor Roble 6 puestos",
    sku: "MUE-MES-001",
    price: 899,
    stock: 3,
    category: "Hogar"
  },
  {
    id: 4,
    name: "Camisa Polo Lacoste Azul",
    sku: "LAC-POL-AZ-001",
    price: 189,
    stock: 45,
    category: "Ropa"
  },
  {
    id: 5,
    name: "Zapatillas Nike Air Max",
    sku: "NIKE-AM-001",
    price: 349,
    stock: 8,
    category: "Deportes"
  }
];

const initialOrders: Order[] = [
  {
    id: 1,
    date: "2024-01-15",
    customer: {
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+51 999 123 456",
      address: "Av. Primavera 123, Surco, Lima"
    },
    items: [
      {
        id: 1,
        productId: 1,
        name: "Laptop HP ProBook 450 G9",
        sku: "HP-PB450-001",
        price: 2899,
        quantity: 1,
        stock: 15,
        category: "Electrónicos"
      }
    ],
    subtotal: 2899,
    tax: 521.82,
    shipping: 50,
    total: 3470.82,
    status: "Confirmado",
    paymentMethod: "Tarjeta de Crédito"
  },
  {
    id: 2,
    date: "2024-01-14",
    customer: {
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+51 998 765 432",
      address: "Jr. Los Olivos 456, Miraflores, Lima"
    },
    items: [
      {
        id: 2,
        productId: 2,
        name: "Smartphone Samsung Galaxy A54",
        sku: "SAMS-GA54-001",
        price: 1299,
        quantity: 2,
        stock: 25,
        category: "Electrónicos"
      }
    ],
    subtotal: 2598,
    tax: 467.64,
    shipping: 30,
    total: 3095.64,
    status: "Enviado",
    paymentMethod: "Transferencia Bancaria"
  }
];

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"cart" | "orders">("cart");

  const addToCart = (productId: number, quantity: number = 1) => {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: Math.min(quantity, product.stock),
        stock: product.stock,
        category: product.category
      };
      setCartItems([...cartItems, newItem]);
    }
    setIsAddProductOpen(false);
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.min(newQuantity, item.stock) };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // IGV 18%
  const shipping = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  const handleCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      customer: {
        name: formData.get("customerName") as string,
        email: formData.get("customerEmail") as string,
        phone: formData.get("customerPhone") as string,
        address: formData.get("customerAddress") as string,
      },
      items: cartItems,
      subtotal,
      tax,
      shipping,
      total,
      status: "Pendiente",
      paymentMethod: formData.get("paymentMethod") as string,
      notes: formData.get("notes") as string || undefined
    };

    setOrders([newOrder, ...orders]);
    clearCart();
    setIsCheckoutOpen(false);
    setCurrentView("orders");
  };

  const filteredOrders = orders.filter(order =>
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Carrito de Compras</h2>
          <p className="text-muted-foreground">Gestiona pedidos y procesa ventas</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={currentView === "cart" ? "default" : "outline"}
            onClick={() => setCurrentView("cart")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Carrito ({cartItems.length})
          </Button>
          <Button 
            variant={currentView === "orders" ? "default" : "outline"}
            onClick={() => setCurrentView("orders")}
          >
            Pedidos ({orders.length})
          </Button>
        </div>
      </div>

      {currentView === "cart" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Productos en el Carrito</span>
                  <Badge variant="secondary">{cartItems.length} productos</Badge>
                </CardTitle>
                <div className="flex space-x-2">
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Agregar Producto al Carrito</DialogTitle>
                        <DialogDescription>
                          Selecciona un producto disponible para agregar al carrito
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-4 max-h-96 overflow-y-auto">
                          {availableProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                                  <ImageWithFallback
                                    src={`https://images.unsplash.com/150x150/?sig=${product.id}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{product.name}</h4>
                                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline">{product.category}</Badge>
                                    <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">S/ {product.price}</p>
                                <Button 
                                  size="sm" 
                                  onClick={() => addToCart(product.id)}
                                  disabled={product.stock === 0}
                                >
                                  Agregar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {cartItems.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearCart}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">El carrito está vacío</p>
                    <p className="text-sm text-muted-foreground">Agrega productos para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={`https://images.unsplash.com/150x150/?sig=${item.productId}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.sku}</p>
                          <Badge variant="outline" className="mt-1">{item.category}</Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="w-16 text-center">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                              min="0"
                              max={item.stock}
                              className="text-center"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right min-w-0">
                          <p className="font-medium">S/ {(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">S/ {item.price} c/u</p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>S/ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span>S/ {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>S/ {shipping}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>S/ {total.toLocaleString()}</span>
                  </div>
                </div>

                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      disabled={cartItems.length === 0}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceder al Pago
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Finalizar Pedido</DialogTitle>
                      <DialogDescription>
                        Completa los datos del cliente para procesar la venta
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customerName">Nombre del Cliente</Label>
                          <Input id="customerName" name="customerName" required />
                        </div>
                        <div>
                          <Label htmlFor="customerEmail">Email</Label>
                          <Input id="customerEmail" name="customerEmail" type="email" required />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customerPhone">Teléfono</Label>
                          <Input id="customerPhone" name="customerPhone" required />
                        </div>
                        <div>
                          <Label htmlFor="paymentMethod">Método de Pago</Label>
                          <Select name="paymentMethod" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona método" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="efectivo">Efectivo</SelectItem>
                              <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                              <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                              <SelectItem value="yape">Yape</SelectItem>
                              <SelectItem value="plin">Plin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="customerAddress">Dirección de Entrega</Label>
                        <Textarea id="customerAddress" name="customerAddress" required />
                      </div>
                      
                      <div>
                        <Label htmlFor="notes">Notas (Opcional)</Label>
                        <Textarea id="notes" name="notes" placeholder="Instrucciones especiales..." />
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <h4 className="font-medium mb-2">Resumen del Pedido</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>S/ {subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>IGV:</span>
                            <span>S/ {tax.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Envío:</span>
                            <span>S/ {shipping}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>S/ {total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar Pedido
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Orders Management */
        <div className="space-y-6">
          {/* Search */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, email o número de pedido..."
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
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido #</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm">
                              <span>{item.name}</span>
                              <span className="text-muted-foreground"> × {item.quantity}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{order.items.length - 2} más
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">S/ {order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === "Entregado" ? "default" :
                            order.status === "Enviado" ? "secondary" :
                            order.status === "Confirmado" ? "outline" :
                            order.status === "Cancelado" ? "destructive" : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{order.paymentMethod}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Order Detail Modal */}
          {selectedOrder && (
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Pedido #{selectedOrder.id}</DialogTitle>
                  <DialogDescription>
                    Detalles completos del pedido
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Información del Cliente</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Nombre</p>
                        <p className="font-medium">{selectedOrder.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedOrder.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Teléfono</p>
                        <p className="font-medium">{selectedOrder.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dirección</p>
                        <p className="font-medium">{selectedOrder.customer.address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span>Información del Pedido</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fecha:</span>
                        <span className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estado:</span>
                        <Badge variant={selectedOrder.status === "Entregado" ? "default" : "secondary"}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Pago:</span>
                        <span className="font-medium">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <span className="font-bold text-lg">S/ {selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Productos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-background rounded overflow-hidden">
                              <ImageWithFallback
                                src={`https://images.unsplash.com/100x100/?sig=${item.productId}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.sku}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">S/ {(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × S/ {item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>S/ {selectedOrder.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IGV (18%):</span>
                        <span>S/ {selectedOrder.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Envío:</span>
                        <span>S/ {selectedOrder.shipping}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>S/ {selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedOrder.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Notas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1">Actualizar Estado</Button>
                  <Button variant="outline" className="flex-1">Imprimir</Button>
                  <Button variant="outline" className="flex-1">Enviar por Email</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}