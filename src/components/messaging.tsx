import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Search, 
  Filter, 
  Bell, 
  Mail, 
  Phone, 
  Users, 
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Paperclip,
  Smile,
  Circle,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Message {
  id: number;
  conversationId: number;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  isRead: boolean;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
  }>;
}

interface Conversation {
  id: number;
  participants: Array<{
    name: string;
    role: string;
    avatar?: string;
    status: "online" | "offline" | "away";
  }>;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: "direct" | "group" | "support";
  priority: "normal" | "high" | "urgent";
  tags: string[];
}

const conversations: Conversation[] = [
  {
    id: 1,
    participants: [
      { name: "María González", role: "Gerente", status: "online" },
      { name: "Carlos Rodríguez", role: "Administrador", status: "online" }
    ],
    title: "Revisión de Inventario Q1",
    lastMessage: "Los números del inventario están listos para revisión",
    lastMessageTime: "2024-01-15T14:30:00",
    unreadCount: 2,
    type: "direct",
    priority: "high",
    tags: ["inventario", "revisión"]
  },
  {
    id: 2,
    participants: [
      { name: "Ana García", role: "Vendedor", status: "away" },
      { name: "Luis Torres", role: "Vendedor", status: "offline" },
      { name: "Rosa Delgado", role: "Gerente", status: "online" }
    ],
    title: "Equipo de Ventas - Norte",
    lastMessage: "¿Cuándo programamos la reunión de ventas?",
    lastMessageTime: "2024-01-15T12:15:00",
    unreadCount: 0,
    type: "group",
    priority: "normal",
    tags: ["ventas", "equipo"]
  },
  {
    id: 3,
    participants: [
      { name: "Cliente: Juan Pérez", role: "Cliente", status: "offline" }
    ],
    title: "Consulta sobre Pedido #1234",
    lastMessage: "Mi pedido aún no ha llegado, ¿cuál es el estado?",
    lastMessageTime: "2024-01-15T10:45:00",
    unreadCount: 1,
    type: "support",
    priority: "urgent",
    tags: ["soporte", "pedido"]
  },
  {
    id: 4,
    participants: [
      { name: "Luis Mendoza", role: "Almacenero", status: "online" }
    ],
    title: "Reporte de Almacén Sur",
    lastMessage: "El inventario físico está completo",
    lastMessageTime: "2024-01-14T16:20:00",
    unreadCount: 0,
    type: "direct",
    priority: "normal",
    tags: ["almacén", "reporte"]
  },
  {
    id: 5,
    participants: [
      { name: "Proveedor: TechSupply", role: "Proveedor", status: "away" }
    ],
    title: "Entrega de Productos Pendientes",
    lastMessage: "La entrega se realizará el miércoles por la mañana",
    lastMessageTime: "2024-01-14T14:10:00",
    unreadCount: 3,
    type: "direct",
    priority: "high",
    tags: ["proveedor", "entrega"]
  }
];

const messages: Message[] = [
  {
    id: 1,
    conversationId: 1,
    sender: "María González",
    senderRole: "Gerente",
    content: "Hola Carlos, ¿tienes disponibles los reportes de inventario del primer trimestre?",
    timestamp: "2024-01-15T14:00:00",
    type: "text",
    isRead: true
  },
  {
    id: 2,
    conversationId: 1,
    sender: "Carlos Rodríguez",
    senderRole: "Administrador",
    content: "¡Hola María! Sí, acabo de terminar el consolidado. Te lo envío en un momento.",
    timestamp: "2024-01-15T14:02:00",
    type: "text",
    isRead: true
  },
  {
    id: 3,
    conversationId: 1,
    sender: "Carlos Rodríguez",
    senderRole: "Administrador",
    content: "Aquí está el reporte completo con el análisis por categorías",
    timestamp: "2024-01-15T14:25:00",
    type: "file",
    isRead: true,
    attachments: [
      { name: "Reporte_Inventario_Q1_2024.pdf", type: "pdf", size: "2.5 MB" }
    ]
  },
  {
    id: 4,
    conversationId: 1,
    sender: "María González",
    senderRole: "Gerente",
    content: "Los números del inventario están listos para revisión. Podemos programar la reunión para mañana?",
    timestamp: "2024-01-15T14:30:00",
    type: "text",
    isRead: false
  },
  {
    id: 5,
    conversationId: 1,
    sender: "María González",
    senderRole: "Gerente",
    content: "También necesitamos revisar los niveles mínimos de stock para algunos productos",
    timestamp: "2024-01-15T14:32:00",
    type: "text",
    isRead: false
  }
];

export function Messaging() {
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages.filter(m => m.conversationId === selectedConversation);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === "all" || conv.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const urgentMessages = conversations.filter(c => c.priority === "urgent").length;
  const onlineUsers = conversations.reduce((count, conv) => {
    return count + conv.participants.filter(p => p.status === "online").length;
  }, 0);

  const sendMessage = () => {
    if (!newMessage.trim() || !currentConversation) return;

    const message: Message = {
      id: Date.now(),
      conversationId: selectedConversation,
      sender: "Carlos Rodríguez", // Usuario actual
      senderRole: "Administrador",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: true
    };

    // En una implementación real, aquí se enviaría el mensaje al servidor
    setNewMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-500";
      case "high": return "text-orange-500";
      case "normal": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Sistema de Mensajería</h2>
          <p className="text-muted-foreground">Comunicación interna y soporte al cliente</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones ({totalUnread})
          </Button>
          <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Conversación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Iniciar Nueva Conversación</DialogTitle>
                <DialogDescription>
                  Selecciona los participantes y el tipo de conversación
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="conv-title">Título de la Conversación</Label>
                  <Input id="conv-title" placeholder="Ej: Reunión de Ventas Q1" />
                </div>
                
                <div>
                  <Label htmlFor="conv-type">Tipo de Conversación</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Conversación Directa</SelectItem>
                      <SelectItem value="group">Grupo</SelectItem>
                      <SelectItem value="support">Soporte al Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="participants">Participantes</Label>
                  <Textarea 
                    id="participants" 
                    placeholder="Buscar usuarios por nombre o email..."
                    className="min-h-20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="conv-priority">Prioridad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">Crear Conversación</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes No Leídos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnread}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversaciones Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
            <p className="text-xs text-muted-foreground">Total de conversaciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios En Línea</CardTitle>
            <Circle className="h-4 w-4 text-green-500 fill-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineUsers}</div>
            <p className="text-xs text-muted-foreground">Disponibles ahora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <Bell className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{urgentMessages}</div>
            <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Messaging Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversaciones</CardTitle>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="direct">Directas</SelectItem>
                  <SelectItem value="group">Grupos</SelectItem>
                  <SelectItem value="support">Soporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              <div className="space-y-1 p-3">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-1">
                          {conversation.participants.slice(0, 2).map((participant, index) => (
                            <div key={index} className="relative">
                              <Avatar className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {participant.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div 
                                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${
                                  getStatusColor(participant.status)
                                }`} 
                              />
                            </div>
                          ))}
                          {conversation.participants.length > 2 && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs border-2 border-background">
                              +{conversation.participants.length - 2}
                            </div>
                          )}
                        </div>
                        <h4 className={`font-medium text-sm truncate ${
                          selectedConversation === conversation.id ? "text-primary-foreground" : ""
                        }`}>
                          {conversation.title}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {conversation.unreadCount > 0 && (
                          <Badge 
                            variant={selectedConversation === conversation.id ? "secondary" : "default"}
                            className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <Star 
                          className={`h-3 w-3 ${
                            getPriorityColor(conversation.priority)
                          } ${conversation.priority === "urgent" ? "fill-current" : ""}`}
                        />
                      </div>
                    </div>
                    
                    <p className={`text-xs truncate ${
                      selectedConversation === conversation.id 
                        ? "text-primary-foreground/80" 
                        : "text-muted-foreground"
                    }`}>
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex space-x-1">
                        {conversation.tags.slice(0, 2).map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant={selectedConversation === conversation.id ? "secondary" : "outline"}
                            className="text-xs px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className={`text-xs ${
                        selectedConversation === conversation.id 
                          ? "text-primary-foreground/60" 
                          : "text-muted-foreground"
                      }`}>
                        {format(new Date(conversation.lastMessageTime), "HH:mm", { locale: es })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3">
          {currentConversation ? (
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-1">
                      {currentConversation.participants.map((participant, index) => (
                        <div key={index} className="relative">
                          <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarFallback>
                              {participant.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div 
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                              getStatusColor(participant.status)
                            }`} 
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-semibold">{currentConversation.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentConversation.participants.length > 1 
                          ? `${currentConversation.participants.length} participantes`
                          : currentConversation.participants[0].role
                        }
                      </p>
                    </div>
                    <Badge variant={
                      currentConversation.priority === "urgent" ? "destructive" :
                      currentConversation.priority === "high" ? "secondary" : "outline"
                    }>
                      {currentConversation.priority === "urgent" ? "Urgente" :
                       currentConversation.priority === "high" ? "Alta" : "Normal"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-1 mt-2">
                  {currentConversation.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <Separator />

              {/* Messages */}
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-[350px] p-4">
                  <div className="space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "Carlos Rodríguez" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className={`max-w-[70%] ${
                          message.sender === "Carlos Rodríguez" ? "order-2" : "order-1"
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            {message.sender !== "Carlos Rodríguez" && (
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {message.sender.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`flex items-center space-x-1 ${
                              message.sender === "Carlos Rodríguez" ? "flex-row-reverse space-x-reverse" : ""
                            }`}>
                              <span className="text-xs font-medium">{message.sender}</span>
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {message.senderRole}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className={`rounded-lg p-3 ${
                            message.sender === "Carlos Rodríguez"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            
                            {message.attachments && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-background/20 rounded">
                                    <Paperclip className="h-4 w-4" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{attachment.name}</p>
                                      <p className="text-xs opacity-70">{attachment.size}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex items-center space-x-1 mt-1 ${
                            message.sender === "Carlos Rodríguez" ? "justify-end" : "justify-start"
                          }`}>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(message.timestamp), "HH:mm", { locale: es })}
                            </span>
                            {message.sender === "Carlos Rodríguez" && (
                              <CheckCircle2 className={`h-3 w-3 ${
                                message.isRead ? "text-blue-500" : "text-muted-foreground"
                              }`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              <Separator />

              {/* Message Input */}
              <CardContent className="flex-shrink-0 pt-4">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Escribe tu mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Selecciona una conversación</h3>
                <p className="text-muted-foreground">
                  Elige una conversación de la lista para comenzar a chatear
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}