// App.jsx
import { Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import LandingPage from "./pages/landingPage";
import SingleProductPage from "./pages/SingleProductPage";

export default function App() {
  return (
    <Routes>
      <Route path="/products" element={<ProductsPage />} />
        <Route path="/productPage" element={<SingleProductPage />} />
     
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}
