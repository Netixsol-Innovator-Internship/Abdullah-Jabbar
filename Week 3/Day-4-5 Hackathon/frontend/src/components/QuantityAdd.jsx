// components/QuantityAdd.jsx
import React, { useState } from "react";

export default function QunatityAdd(props) {
  // props supported:
  // quantity, setQuantity, onAddToBag
  const {
    quantity: propQuantity,
    setQuantity: propSetQuantity,
    onAddToBag,
  } = props || {};

  const [internalQuantity, setInternalQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // fallback modal

  const quantity =
    typeof propQuantity === "number" ? propQuantity : internalQuantity;
  const setQuantity = propSetQuantity ?? setInternalQuantity;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAdd = () => {
    if (typeof onAddToBag === "function") {
      onAddToBag();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col  gap-8">
      <div className="mt-8 flex gap-10">
        <div className="flex items-center overflow-hidden text-lg font-semibold text-gray-800 shadow-sm">
          <button
            onClick={handleDecrement}
            className="px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            <span className="text-3xl">-</span>
          </button>

          <span className="px-6 py-2 ">{quantity}</span>

          <button
            onClick={handleIncrement}
            className=" px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            <span className="text-3xl">+</span>
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex justify-center items-center gap-2 px-6 py-3 bg-gray-800 text-white hover:bg-black transition-colors  max-w-xs md:max-w-md lg:max-w-lg"
        >
          <svg
            className="self-center w-5 h-5"
            viewBox="0 0 14 17"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.75 16.243C1.3375 16.243 0.98425 16.0962 0.69025 15.8027C0.39675 15.5087 0.25 15.1555 0.25 14.743V5.74298C0.25 5.33048 0.39675 4.97748 0.69025 4.68398C0.98425 4.38998 1.3375 4.24298 1.75 4.24298H3.25C3.25 3.20548 3.61575 2.32098 4.34725 1.58948C5.07825 0.858481 5.9625 0.492981 7 0.492981C8.0375 0.492981 8.922 0.858481 9.6535 1.58948C10.3845 2.32098 10.75 3.20548 10.75 4.24298H12.25C12.6625 4.24298 13.0157 4.38998 13.3097 4.68398C13.6033 4.97748 13.75 5.33048 13.75 5.74298V14.743C13.75 15.1555 13.6033 15.5087 13.3097 15.8027C13.0157 16.0962 12.6625 16.243 12.25 16.243H1.75ZM1.75 14.743H12.25V5.74298H1.75V14.743ZM7 10.243C8.0375 10.243 8.922 9.87723 9.6535 9.14573C10.3845 8.41473 10.75 7.53048 10.75 6.49298H9.25C9.25 7.11798 9.03125 7.64923 8.59375 8.08673C8.15625 8.52423 7.625 8.74298 7 8.74298C6.375 8.74298 5.84375 8.52423 5.40625 8.08673C4.96875 7.64923 4.75 7.11798 4.75 6.49298H3.25C3.25 7.53048 3.61575 8.41473 4.34725 9.14573C5.07825 9.87723 5.9625 10.243 7 10.243ZM4.75 4.24298H9.25C9.25 3.61798 9.03125 3.08673 8.59375 2.64923C8.15625 2.21173 7.625 1.99298 7 1.99298C6.375 1.99298 5.84375 2.21173 5.40625 2.64923C4.96875 3.08673 4.75 3.61798 4.75 4.24298Z" />
          </svg>

          <span>ADD TO BAG</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Item Added to Bag</h2>
            <p className="mb-6">Quantity: {quantity}</p>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
