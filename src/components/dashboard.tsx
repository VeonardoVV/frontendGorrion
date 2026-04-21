import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Package, Warehouse, TrendingUp, AlertTriangle, DollarSign, Users } from "lucide-react";

const salesData = [
  { name: "Ene", ventas: 4000, inventario: 2400 },
  { name: "Feb", ventas: 3000, inventario: 1398 },
  { name: "Mar", ventas: 2000, inventario: 9800 },
  { name: "Abr", ventas: 2780, inventario: 3908 },
  { name: "May", ventas: 1890, inventario: 4800 },
  { name: "Jun", ventas: 2390, inventario: 3800 },
];

const productDistribution = [
  { name: "Electrónicos", value: 400, color: "#0088FE" },
  { name: "Ropa", value: 300, color: "#00C49F" },
  { name: "Hogar", value: 300, color: "#FFBB28" },
  { name: "Deportes", value: 200, color: "#FF8042" },
];

const topProducts = [
  { id: 1, name: "Laptop HP ProBook", ventas: 145, stock: 12, categoria: "Electrónicos" },
  { id: 2, name: "Camisa Polo", ventas: 134, stock: 45, categoria: "Ropa" },
  { id: 3, name: "Mesa de Comedor", ventas: 98, stock: 8, categoria: "Hogar" },
  { id: 4, name: "Zapatillas Nike", ventas: 87, stock: 23, categoria: "Deportes" },
  { id: 5, name: "Smartphone Samsung", ventas: 76, stock: 15, categoria: "Electrónicos" },
];

const recentMovements = [
  { id: 1, tipo: "Entrada", producto: "Laptop Dell XPS", cantidad: 10, fecha: "2024-01-15", almacen: "Almacén Central" },
  { id: 2, tipo: "Salida", producto: "Camisa Polo", cantidad: 5, fecha: "2024-01-15", almacen: "Sucursal Norte" },
  { id: 3, tipo: "Transferencia", producto: "Mesa de Comedor", cantidad: 3, fecha: "2024-01-14", almacen: "Almacén Sur" },
  { id: 4, tipo: "Entrada", producto: "Zapatillas Adidas", cantidad: 20, fecha: "2024-01-14", almacen: "Almacén Central" },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Resumen general del sistema de inventario</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-green-50">Sistema Activo</Badge>
          <Badge variant="secondary">15 Ene 2024</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,845</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Almacenes Activos</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 sucursales principales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +8.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">23</div>
            <p className="text-xs text-muted-foreground">
              Productos necesitan reposición
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas vs Inventario</CardTitle>
            <CardDescription>Comparativa mensual de ventas e inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#0088FE" />
                <Bar dataKey="inventario" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
            <CardDescription>Porcentaje de productos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Recent Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productos Top</CardTitle>
            <CardDescription>Los productos más vendidos este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.ventas} ventas</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimientos Recientes</CardTitle>
            <CardDescription>Últimas transacciones de inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={movement.tipo === "Entrada" ? "default" : movement.tipo === "Salida" ? "destructive" : "secondary"}
                      >
                        {movement.tipo}
                      </Badge>
                      <span className="font-medium">{movement.producto}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{movement.almacen}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{movement.cantidad} unidades</p>
                    <p className="text-sm text-muted-foreground">{movement.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}