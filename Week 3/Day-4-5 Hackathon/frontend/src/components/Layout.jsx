// components/Layout.jsx
import Header from "./Header";
import Footer from "./Footer";
import CartModal from "./CartModal";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
