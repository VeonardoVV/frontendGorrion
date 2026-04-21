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
import { Plus, Package, Search, Filter, Edit, Trash2, TrendingUp, AlertCircle, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  description: string;
  status: "Activo" | "Inactivo" | "Descontinuado";
  location: string;
  supplier: string;
  salesThisMonth: number;
  image?: string;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Laptop HP ProBook 450 G9",
    sku: "HP-PB450-001",
    category: "Electrónicos",
    brand: "HP",
    price: 2899,
    cost: 2200,
    stock: 15,
    minStock: 5,
    maxStock: 50,
    description: "Laptop empresarial con procesador Intel Core i5, 8GB RAM, 256GB SSD",
    status: "Activo",
    location: "Almacén Central - Sección A",
    supplier: "Distribuidora Tech SAC",
    salesThisMonth: 8
  },
  {
    id: 2,
    name: "Smartphone Samsung Galaxy A54",
    sku: "SAMS-GA54-001",
    category: "Electrónicos",
    brand: "Samsung",
    price: 1299,
    cost: 950,
    stock: 25,
    minStock: 10,
    maxStock: 100,
    description: "Smartphone con pantalla 6.4', 128GB, cámara 50MP",
    status: "Activo",
    location: "Almacén Central - Sección A",
    supplier: "Samsung Perú",
    salesThisMonth: 15
  },
  {
    id: 3,
    name: "Mesa de Comedor Roble 6 puestos",
    sku: "MUE-MES-001",
    category: "Hogar",
    brand: "Muebles Perú",
    price: 899,
    cost: 600,
    stock: 3,
    minStock: 2,
    maxStock: 15,
    description: "Mesa de comedor en madera de roble para 6 personas",
    status: "Activo",
    location: "Almacén Central - Sección B",
    supplier: "Muebles Perú SAC",
    salesThisMonth: 2
  },
  {
    id: 4,
    name: "Camisa Polo Lacoste Azul",
    sku: "LAC-POL-AZ-001",
    category: "Ropa",
    brand: "Lacoste",
    price: 189,
    cost: 120,
    stock: 45,
    minStock: 20,
    maxStock: 200,
    description: "Camisa polo de algodón 100%, talla M, color azul marino",
    status: "Activo",
    location: "Almacén Norte - Sección A",
    supplier: "Textiles Premium",
    salesThisMonth: 23
  },
  {
    id: 5,
    name: "Zapatillas Nike Air Max",
    sku: "NIKE-AM-001",
    category: "Deportes",
    brand: "Nike",
    price: 349,
    cost: 220,
    stock: 8,
    minStock: 10,
    maxStock: 80,
    description: "Zapatillas deportivas Nike Air Max, talla 42, color negro/blanco",
    status: "Activo",
    location: "Almacén Sur - Sección A",
    supplier: "Nike Store",
    salesThisMonth: 12
  }
];

const categories = ["Todos", "Electrónicos", "Ropa", "Hogar", "Deportes", "Accesorios"];
const brands = ["Todas", "HP", "Samsung", "Nike", "Lacoste", "Muebles Perú"];

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "Todas" || product.brand === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const topProducts = [...products].sort((a, b) => b.salesThisMonth - a.salesThisMonth).slice(0, 5);
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.cost), 0);

  const handleCreateProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newProduct: Product = {
      id: Date.now(),
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      category: formData.get("category") as string,
      brand: formData.get("brand") as string,
      price: parseFloat(formData.get("price") as string),
      cost: parseFloat(formData.get("cost") as string),
      stock: parseInt(formData.get("stock") as string),
      minStock: parseInt(formData.get("minStock") as string),
      maxStock: parseInt(formData.get("maxStock") as string),
      description: formData.get("description") as string,
      status: "Activo",
      location: formData.get("location") as string,
      supplier: formData.get("supplier") as string,
      salesThisMonth: 0
    };

    setProducts([...products, newProduct]);
    setIsCreateProductOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Productos</h2>
          <p className="text-muted-foreground">Administra el catálogo de productos y su inventario</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
            {viewMode === "grid" ? "Vista Tabla" : "Vista Grid"}
          </Button>
          <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Completa la información del nuevo producto
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-name">Nombre del Producto</Label>
                    <Input id="product-name" name="name" placeholder="Ej: Laptop HP ProBook" required />
                  </div>
                  <div>
                    <Label htmlFor="product-sku">SKU</Label>
                    <Input id="product-sku" name="sku" placeholder="HP-PB-001" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="product-category">Categoría</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="product-brand">Marca</Label>
                    <Input id="product-brand" name="brand" placeholder="Marca" required />
                  </div>
                  <div>
                    <Label htmlFor="product-supplier">Proveedor</Label>
                    <Input id="product-supplier" name="supplier" placeholder="Proveedor" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-price">Precio de Venta (S/)</Label>
                    <Input id="product-price" name="price" type="number" step="0.01" placeholder="299.99" required />
                  </div>
                  <div>
                    <Label htmlFor="product-cost">Costo (S/)</Label>
                    <Input id="product-cost" name="cost" type="number" step="0.01" placeholder="199.99" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="product-stock">Stock Actual</Label>
                    <Input id="product-stock" name="stock" type="number" placeholder="100" required />
                  </div>
                  <div>
                    <Label htmlFor="product-min-stock">Stock Mínimo</Label>
                    <Input id="product-min-stock" name="minStock" type="number" placeholder="10" required />
                  </div>
                  <div>
                    <Label htmlFor="product-max-stock">Stock Máximo</Label>
                    <Input id="product-max-stock" name="maxStock" type="number" placeholder="500" required />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="product-location">Ubicación</Label>
                  <Input id="product-location" name="location" placeholder="Almacén Central - Sección A" required />
                </div>
                
                <div>
                  <Label htmlFor="product-description">Descripción</Label>
                  <Textarea id="product-description" name="description" placeholder="Descripción detallada del producto" required />
                </div>
                
                <Button type="submit" className="w-full">Crear Producto</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter(p => p.status === "Activo").length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">En inventario</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">Necesitan reposición</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
            <p className="text-xs text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Productos Top del Mes</span>
          </CardTitle>
          <CardDescription>Los productos más vendidos este mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="text-center">
                <div className="relative mb-2">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/400x300/?sig=${product.id}`}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.salesThisMonth} ventas</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar productos por nombre, SKU o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="aspect-square mb-3 bg-muted rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/400x400/?sig=${product.id}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                  <Badge variant={product.status === "Activo" ? "default" : "secondary"} className="ml-2">
                    {product.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{product.sku}</span>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">S/ {product.price}</span>
                  <span className="text-sm text-muted-foreground">Costo: S/ {product.cost}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stock:</span>
                    <span className={product.stock <= product.minStock ? "text-destructive font-medium" : ""}>
                      {product.stock} unidades
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        product.stock <= product.minStock ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min((product.stock / product.maxStock) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {product.minStock}</span>
                    <span>Max: {product.maxStock}</span>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-muted-foreground">Ventas este mes:</p>
                  <p className="font-medium">{product.salesThisMonth} unidades</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedProduct(product)}
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                    <TableCell>S/ {product.price}</TableCell>
                    <TableCell className={product.stock <= product.minStock ? "text-destructive" : ""}>
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "Activo" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedProduct(product)}
                        >
                          Ver
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>Información detallada del producto</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/800x800/?sig=${selectedProduct.id}`}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Descripción</h4>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-medium">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <Badge variant={selectedProduct.status === "Activo" ? "default" : "secondary"}>
                      {selectedProduct.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categoría</p>
                    <Badge variant="outline">{selectedProduct.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Marca</p>
                    <p className="font-medium">{selectedProduct.brand}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Precio de Venta</p>
                    <p className="text-xl font-bold">S/ {selectedProduct.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Costo</p>
                    <p className="text-lg font-medium">S/ {selectedProduct.cost}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Margen de Ganancia</p>
                  <p className="text-lg font-bold text-green-600">
                    {(((selectedProduct.price - selectedProduct.cost) / selectedProduct.cost) * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Inventario</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Mínimo</p>
                      <p className="font-medium">{selectedProduct.minStock}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Actual</p>
                      <p className={`text-xl font-bold ${selectedProduct.stock <= selectedProduct.minStock ? "text-destructive" : ""}`}>
                        {selectedProduct.stock}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Máximo</p>
                      <p className="font-medium">{selectedProduct.maxStock}</p>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        selectedProduct.stock <= selectedProduct.minStock ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min((selectedProduct.stock / selectedProduct.maxStock) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ubicación</p>
                    <p className="font-medium">{selectedProduct.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Proveedor</p>
                    <p className="font-medium">{selectedProduct.supplier}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Ventas este Mes</p>
                  <p className="text-xl font-bold text-blue-600">{selectedProduct.salesThisMonth} unidades</p>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Historial
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}