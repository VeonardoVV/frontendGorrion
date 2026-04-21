import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../../app/routes/ProtectedRoutes";
import TestimonioFerreteria from "../pages/testimonioferreteriaPage";


export default [
    <Route key="testimonioferreteria" path="/testimonioferreteria" element={<TestimonioFerreteria />} />,
    
];