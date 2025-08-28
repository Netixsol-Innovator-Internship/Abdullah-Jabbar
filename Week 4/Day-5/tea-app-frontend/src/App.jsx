import { Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import LandingPage from "./pages/LandingPage";
import SingleProductPage from "./pages/SingleProductPage";
import Layout from "./components/Layout";
import AdminDashboardPage from "./pages/DashboardPage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop /> {/* ✅ placed outside Routes */}

      <Routes>
        {/* All routes share the layout */}
        <Route element={<Layout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/productPage/:key" element={<SingleProductPage />} />
        </Route>
      </Routes>
    </>
  );
}
