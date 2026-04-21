import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../../app/routes/ProtectedRoutes";
import HomePage from "../pages/bannerferreteriaPage";


export default [
    <Route key="bannerferreteria" path="/bannerferreteria" element={<HomePage />} />,
    
];