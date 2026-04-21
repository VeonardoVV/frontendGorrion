import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../../app/routes/ProtectedRoutes";
import LogoFerreteria from "../pages/logoferreteriaPage";


export default [
    <Route key="logoferreteria" path="/logoferreteria" element={<LogoFerreteria />} />,
    
];