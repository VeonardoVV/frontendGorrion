import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../../app/routes/ProtectedRoutes";
import HomePage from "../pages/HomePage";


export default [
    <Route key="home" path="/home" element={<HomePage />} />,
    
];