// App.jsx
import { Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import LandingPage from "./pages/landingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}
