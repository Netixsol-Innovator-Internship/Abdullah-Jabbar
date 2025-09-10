"use client";

import ItemCard from "./ItemCard";
import { useGetTeasQuery } from "../services/api"; // adjust import path

export default function Recommended() {
  // Fetch teas from backend
  const { data: teas, isLoading, isError } = useGetTeasQuery();

  return (
    <section className="max-w-210 mx-auto my-20">
      <h1 className="text-3xl text-center font-prosto">You may also like</h1>

      {/* Loading / Error states */}
      {isLoading && <p className="text-center mt-6">Loading teas...</p>}
      {isError && <p className="text-red-500 text-center mt-6">Failed to load teas.</p>}

      {/* Grid of teas */}
      {!isLoading && !isError && (
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teas && teas.length > 0 ? (
            teas
              .slice(-3) // last 3 teas
              .map((product) => (
                <ItemCard
                  key={product._id} // use MongoDB _id
                  id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  weight={product.weight}
                />
              ))
          ) : (
            <p className="text-center">No teas found.</p>
          )}
        </div>
      )}
    </section>
  );
}
