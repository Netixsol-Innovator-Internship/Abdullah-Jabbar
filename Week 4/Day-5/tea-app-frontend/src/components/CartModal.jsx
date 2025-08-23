// components/CartModal.jsx
import React, { useState } from "react";

export default function CartModal(props) {
  const { isOpen, onClose, cartItems: cartItemsProp, setCartItems: setCartItemsProp } = props || {};



  const [internalCartItems, setInternalCartItems] = useState([]);

  const isControlled = Array.isArray(cartItemsProp) && typeof setCartItemsProp === "function";
  const activeCartItems = isControlled ? cartItemsProp : internalCartItems;

  const updateCartItems = (updater) => {
    if (isControlled) {
      if (typeof updater === "function") {
        setCartItemsProp((prev) => updater(prev));
      } else {
        setCartItemsProp(updater);
      }
    } else {
      setInternalCartItems((prev) => (typeof updater === "function" ? updater(prev) : updater));
    }
  };

  const increment = (id) => {
    updateCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decrement = (id) => {
    updateCartItems((prev) =>
      prev.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
    );
  };

  const removeItem = (id) => {
    updateCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const parsePrice = (value) => {
    if (value === null || value === undefined) return 0;
    const s = String(value).trim();
    let cleaned = s.replace(",", ".").replace(/[^0-9.()-]/g, "");
    if ((cleaned.match(/\./g) || []).length > 1) {
      const parts = cleaned.split(".");
      const decimals = parts.pop();
      const integer = parts.join("");
      cleaned = integer + "." + decimals;
    }
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const subtotal = activeCartItems.reduce((acc, item) => {
    const priceNum = parsePrice(item.price);
    const qty = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 0;
    return acc + priceNum * qty;
  }, 0);

const delivery = activeCartItems.length > 0 ? 3.95 : 0;
const total = subtotal + delivery;

  if (!isOpen) return null;

  // handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-40"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        {/* Close button top right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">My Bag</h2>
        <div className="space-y-4">
          {activeCartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 mt-1">
                    REMOVE
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => decrement(item.id)} className="px-2 py-1 border rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increment(item.id)} className="px-2 py-1 border rounded">+</button>
                <span className="ml-2 font-medium">€{(parsePrice(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>€{delivery.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <button className="w-full mt-4 bg-black text-white py-2 rounded" onClick={onClose}>
            PURCHASE
          </button>
        </div>
      </div>
    </div>
  );
}
