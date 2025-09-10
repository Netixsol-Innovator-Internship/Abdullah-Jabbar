import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Variants from "./Variants";
import QunatityAdd from "./QuantityAdd";
import CartModal from "./CartModal";

const SingleItem = () => {
  const { key } = useParams(); // ✅ get id from URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("id from singleItem ", key);

  // fetch single product by id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE || "http://localhost:4000/api"}/teas/${key}`
        );
        console.log("res from singleItem ", res);
        setProduct(res.data);
      } catch (err) {
        console.log("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [key]);

  if (loading) return <p>Loading...</p>;
  console.log("product from singleItem ", product);
  if (!product) return <p>Product not found</p>;
  /**
   * parsePrice(value)
   * - Converts various price formats to a plain number.
   * - Accepts numbers or strings like "€3.90", "3,90", "3.9", "3".
   * - Returns 0 for invalid values.
   */
  const parsePrice = (value) => {
    if (value === null || value === undefined) return 0;
    const s = String(value).trim();
    // replace comma with dot (handles "3,90"), remove currency/symbol chars
    let cleaned = s.replace(",", ".").replace(/[^0-9.()-.]/g, "");
    // if multiple dots, keep last as decimal separator
    if ((cleaned.match(/\./g) || []).length > 1) {
      const parts = cleaned.split(".");
      const decimals = parts.pop();
      const integer = parts.join("");
      cleaned = integer + "." + decimals;
    }
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const handleAddToBag = () => {
    const productId = product?.id ?? key;
    const numericPrice = parsePrice(product.price);

    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === productId);
      if (existing) {
        // If item exists, only increase quantity (price is already stored on the item)
        return prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                quantity:
                  (Number.isFinite(Number(p.quantity))
                    ? Number(p.quantity)
                    : 0) + Number(quantity),
              }
            : p
        );
      }
      // Add a new item with numeric price and the selected quantity
      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          description: product.description ?? "",
          price: numericPrice,
          quantity: Number(quantity) || 0,
          image: product.image ?? "",
        },
      ];
    });

    // open cart modal after adding
    setIsModalOpen(true);
  };

  return (
    <section className="w-full  px-6 sm:px-10 md:px-14 lg:px-18">
      <p className="text-xs font-medium mb-4">
        HOME / COLLECTIONS / PRODUCTS / {product.name.toUpperCase()}
      </p>

      <div className="flex w-full mt-6 gap-8">
        <div className="w-1/2">
          <img
            src={product.image}
            className="max-w-114 w-full h-full object-cover"
            alt={product.name}
          />
        </div>

        <div className="w-1/2">
          <div className="flex flex-col flex-1">
            <h1 className="text-4xl font-bold mb-2 pr-14">{product.name}</h1>
            <p className="text-gray-700 mb-4 leading-16">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex">
                <svg
                  className="self-center"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.32083 0.7875 6.1125C1.3125 4.90417 2.02917 3.84583 2.9375 2.9375C3.84583 2.02917 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6792 0.2625 13.8875 0.7875C15.0958 1.3125 16.1542 2.02917 17.0625 2.9375C17.9708 3.84583 18.6875 4.90417 19.2125 6.1125C19.7375 7.32083 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.9708 16.1542 17.0625 17.0625C16.1542 17.9708 15.0958 18.6875 13.8875 19.2125C12.6792 19.7375 11.3833 20 10 20ZM10 17.95C10.4333 17.35 10.8083 16.725 11.125 16.075C11.4417 15.425 11.7 14.7333 11.9 14H8.1C8.3 14.7333 8.55833 15.425 8.875 16.075C9.19167 16.725 9.56667 17.35 10 17.95ZM7.4 17.55C7.1 17 6.8375 16.4292 6.6125 15.8375C6.3875 15.2458 6.2 14.6333 6.05 14H3.1C3.58333 14.8333 4.1875 15.5583 4.9125 16.175C5.6375 16.7917 6.46667 17.25 7.4 17.55ZM12.6 17.55C13.5333 17.25 14.3625 16.7917 15.0875 16.175C15.8125 15.5583 16.4167 14.8333 16.9 14H13.95C13.8 14.6333 13.6125 15.2458 13.3875 15.8375C13.1625 16.4292 12.9 17 12.6 17.55ZM2.25 12H5.65C5.6 11.6667 5.5625 11.3375 5.5375 11.0125C5.5125 10.6875 5.5 10.35 5.5 10C5.5 9.65 5.5125 9.3125 5.5375 8.9875C5.5625 8.6625 5.6 8.33333 5.65 8H2.25C2.16667 8.33333 2.10417 8.6625 2.0625 8.9875C2.02083 9.3125 2 9.65 2 10C2 10.35 2.02083 10.6875 2.0625 11.0125C2.10417 11.3375 2.16667 11.6667 2.25 12ZM7.65 12H12.35C12.4 11.6667 12.4375 11.3375 12.4625 11.0125C12.4875 10.6875 12.5 10.35 12.5 10C12.5 9.65 12.4875 9.3125 12.4625 8.9875C12.4375 8.6625 12.4 8.33333 12.35 8H7.65C7.6 8.33333 7.5625 8.6625 7.5375 8.9875C7.5125 9.3125 7.5 9.65 7.5 10C7.5 10.35 7.5125 10.6875 7.5375 11.0125C7.5625 11.3375 7.6 11.6667 7.65 12ZM14.35 12H17.75C17.8333 11.6667 17.8958 11.3375 17.9375 11.0125C17.9792 10.6875 18 10.35 18 10C18 9.65 17.9792 9.3125 17.9375 8.9875C17.8958 8.6625 17.8333 8.33333 17.75 8H14.35C14.4 8.33333 14.4375 8.6625 14.4625 8.9875C14.4875 9.3125 14.5 9.65 14.5 10C14.5 10.35 14.4875 10.6875 14.4625 11.0125C14.4375 11.3375 14.4 11.6667 14.35 12ZM13.95 6H16.9C16.4167 5.16667 15.8125 4.44167 15.0875 3.825C14.3625 3.20833 13.5333 2.75 12.6 2.45C12.9 3 13.1625 3.57083 13.3875 4.1625C13.6125 4.75417 13.8 5.36667 13.95 6ZM8.1 6H11.9C11.7 5.26667 11.4417 4.575 11.125 3.925C10.8083 3.275 10.4333 2.65 10 2.05C9.56667 2.65 9.19167 3.275 8.875 3.925C8.55833 4.575 8.3 5.26667 8.1 6ZM3.1 6H6.05C6.2 5.36667 6.3875 4.75417 6.6125 4.1625C6.8375 3.57083 7.1 3 7.4 2.45C6.46667 2.75 5.6375 3.20833 4.9125 3.825C4.1875 4.44167 3.58333 5.16667 3.1 6Z"
                    fill="#282828"
                  />
                </svg>

                <span className=" px-3 py-1 rounded">
                  Origin: {product.origin}
                </span>
              </div>

              <div className="flex">
                <svg
                  className="self-center"
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 15V17H18V15H2ZM2 4H4.2C4.11667 3.85 4.0625 3.69167 4.0375 3.525C4.0125 3.35833 4 3.18333 4 3C4 2.16667 4.29167 1.45833 4.875 0.875C5.45833 0.291667 6.16667 0 7 0C7.5 0 7.9625 0.129167 8.3875 0.3875C8.8125 0.645833 9.18333 0.966667 9.5 1.35L10 2L10.5 1.35C10.8 0.95 11.1667 0.625 11.6 0.375C12.0333 0.125 12.5 0 13 0C13.8333 0 14.5417 0.291667 15.125 0.875C15.7083 1.45833 16 2.16667 16 3C16 3.18333 15.9875 3.35833 15.9625 3.525C15.9375 3.69167 15.8833 3.85 15.8 4H18C18.55 4 19.0208 4.19583 19.4125 4.5875C19.8042 4.97917 20 5.45 20 6V17C20 17.55 19.8042 18.0208 19.4125 18.4125C19.0208 18.8042 18.55 19 18 19H2C1.45 19 0.979167 18.8042 0.5875 18.4125C0.195833 18.0208 0 17.55 0 17V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4ZM2 12H18V6H12.9L15 8.85L13.4 10L10 5.4L6.6 10L5 8.85L7.05 6H2V12ZM7 4C7.28333 4 7.52083 3.90417 7.7125 3.7125C7.90417 3.52083 8 3.28333 8 3C8 2.71667 7.90417 2.47917 7.7125 2.2875C7.52083 2.09583 7.28333 2 7 2C6.71667 2 6.47917 2.09583 6.2875 2.2875C6.09583 2.47917 6 2.71667 6 3C6 3.28333 6.09583 3.52083 6.2875 3.7125C6.47917 3.90417 6.71667 4 7 4ZM13 4C13.2833 4 13.5208 3.90417 13.7125 3.7125C13.9042 3.52083 14 3.28333 14 3C14 2.71667 13.9042 2.47917 13.7125 2.2875C13.5208 2.09583 13.28333 2 13 2C12.7167 2 12.4792 2.09583 12.2875 2.2875C12.0958 2.47917 12 2.71667 12 3C12 3.28333 12.0958 3.52083 12.2875 3.7125C12.4792 3.90417 12.7167 4 13 4Z"
                    fill="#282828"
                  />
                </svg>

                {product.organic && (
                  <span className=" px-3 py-1 rounded">Organic</span>
                )}
              </div>
              <div className="flex">
                <svg
                  className="self-center"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.4 14.6C1.65 13.85 1.0625 12.9833 0.6375 12C0.2125 11.0167 0 10 0 8.95C0 7.9 0.2 6.8625 0.6 5.8375C1 4.8125 1.65 3.85 2.55 2.95C3.13333 2.36666 3.85417 1.86666 4.7125 1.45C5.57083 1.03333 6.5875 0.704165 7.7625 0.462498C8.9375 0.220831 10.2792 0.0749981 11.7875 0.0249981C13.2958 -0.0250019 14.9833 0.0333315 16.85 0.199998C16.9833 1.96666 17.025 3.59166 16.975 5.075C16.925 6.55833 16.7875 7.89583 16.5625 9.0875C16.3375 10.2792 16.0208 11.3208 15.6125 12.2125C15.2042 13.1042 14.7 13.85 14.1 14.45C13.2167 15.3333 12.2792 15.9792 11.2875 16.3875C10.2958 16.7958 9.28333 17 8.25 17C7.16667 17 6.10833 16.7875 5.075 16.3625C4.04167 15.9375 3.15 15.35 2.4 14.6ZM5.2 14.2C5.68333 14.4833 6.17917 14.6875 6.6875 14.8125C7.19583 14.9375 7.71667 15 8.25 15C9.01667 15 9.775 14.8458 10.525 14.5375C11.275 14.2292 11.9917 13.7333 12.675 13.05C12.975 12.75 13.2792 12.3292 13.5875 11.7875C13.8958 11.2458 14.1625 10.5375 14.3875 9.6625C14.6125 8.7875 14.7833 7.72917 14.9 6.4875C15.0167 5.24583 15.0333 3.76666 14.95 2.05C14.1333 2.01666 13.2125 2.00416 12.1875 2.0125C11.1625 2.02083 10.1417 2.1 9.125 2.25C8.10833 2.4 7.14167 2.64166 6.225 2.975C5.30833 3.30833 4.55833 3.76666 3.975 4.35C3.225 5.1 2.70833 5.84166 2.425 6.575C2.14167 7.30833 2 8.01666 2 8.7C2 9.68333 2.1875 10.5458 2.5625 11.2875C2.9375 12.0292 3.26667 12.55 3.55 12.85C4.25 11.5167 5.175 10.2375 6.325 9.0125C7.475 7.7875 8.81667 6.78333 10.35 6C9.15 7.05 8.10417 8.2375 7.2125 9.5625C6.32083 10.8875 5.65 12.4333 5.2 14.2Z"
                    fill="#282828"
                  />
                </svg>

                <span className=" px-3 py-1 rounded">Vegan</span>
              </div>
            </div>

            <p className="text-4xl font-semibold mb-4 leading-10">
              {product.price}
            </p>

            <div>
              <p>Variants</p>
              <div className="flex gap-x-4">
                <Variants />
              </div>
            </div>
            <QunatityAdd
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToBag={handleAddToBag}
            />
          </div>
        </div>
      </div>

      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </section>
  );
};

export default SingleItem;
