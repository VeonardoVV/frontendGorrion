import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../../app/routes/ProtectedRoutes";
import HomePage from "../pages/ferreteriaPage";


export default [
    <Route key="ferreteria" path="/ferreteria" element={<HomePage />} />,
    
];