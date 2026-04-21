import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "../../shared/layouts/AuthLayout";
import AdminLayout from "../../shared/layouts/AdminLayout";
import SeeProductLayout from "../../shared/layouts/SeeProductLayout";
import CarLayout from "../../shared/layouts/CarLayout";

import BannerFerreteriaLayout from "../../shared/layouts/BannerFerreteriaLayout";
import LogoFerreteriaLayout from "../../shared/layouts/LogoFerreteriaLayout";
import TestimonioFerreteriaLayout from "../../shared/layouts/TestimonioFerreteriaLayout";



/* rutas */
import AuthRoutes from "../../modules/auth/routes/AuthRoutes";
import HomeRoutes from "../../modules/home/routes/HomeRoutes";
import CartRoutes from "../../modules/cart/routes/CartRoutes";
import UsersRoutes from "../../modules/users/routes/UsersRoutes";
import ShopLayout from "../../shared/layouts/ShopLayout";
import ProductRoutes from "../../modules/product/routes/ProductRoutes";
import FerreteriaRoutes from "../../modules/ferreteria/routes/ferreteriaRoutes";
import BannerFerreteriaRoutes from "../../modules/bannerferreteria/routes/bannerferreteriaRoutes";
import LogoFerreteriaRoutes from "../../modules/logoferreteria/routes/logoferreteriaRoutes";
import TestimonioFerreteriaRoutes from "../../modules/testimonioferreteria/routes/testimonioferreteriaRoutes";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* rutas para el login */}
                <Route element={<ShopLayout />}>
                    {AuthRoutes}
                </Route>

                {/* rutas que estaran dentro del ecomerce*/}
                <Route element={<SeeProductLayout />}>
                    {/* aquí vinculamos todos los módulos como asistencia, agregar, etc */}
                    {HomeRoutes},  
                                {/* estas comas fueron una torturaaaaaaaaa 4 hrs buscando como hacer que me lo envie a /product */}
                </Route>
                <Route element={<SeeProductLayout />}>
                    {ProductRoutes}
                </Route>
                <Route element={<SeeProductLayout />}>
                    {CartRoutes}
                </Route>
                <Route element={<CarLayout />}>
                    {FerreteriaRoutes}
                </Route>

                <Route element={<BannerFerreteriaLayout />}>
                    {BannerFerreteriaRoutes}
                </Route>

                <Route element={<LogoFerreteriaLayout />}>
                    {LogoFerreteriaRoutes}
                </Route>

                <Route element={<TestimonioFerreteriaLayout />}>
                    {TestimonioFerreteriaRoutes}
                </Route>
                {/* rutas que estaran dentro del panel administrativo*/}
                
                <Route element={<AdminLayout />}>
                    {/* aquí vinculamos todos los módulos como asisencia, agregar, etc */}

                </Route>
                {/* tenemos la pagina por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}
