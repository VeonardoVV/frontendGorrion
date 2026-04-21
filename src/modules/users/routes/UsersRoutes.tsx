import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../../app/routes/ProtectedRoutes"
import UsersPage from "../pages/UsersPage"
/* usamoes el export default para agrupar las rutas y mantener el appRoutes
usamos el protectedRoutes para no permitir que se ingrese sin que tenga el login o la session */

export default [
    <Route key="users" path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />,

];