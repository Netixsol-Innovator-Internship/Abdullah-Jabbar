// App.jsx
import { Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import LandingPage from "./pages/LandingPage";
import SingleProductPage from "./pages/SingleProductPage";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      {/* All routes share the layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/productPage" element={<SingleProductPage />} />
      </Route>
    </Routes>
  );
}
