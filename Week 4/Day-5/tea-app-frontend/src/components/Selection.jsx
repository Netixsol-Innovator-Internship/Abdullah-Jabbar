// Selection.jsx
"use client";

import ItemCard from "./ItemCard";
import SelectionFilters from "./SelectionFilters";
import OrganicToggle from "./OrganicFilter";
import { useGetTeasQuery } from "../services/api"; // adjust path if api.js is elsewhere

export default function Selection() {
  // Fetch teas from backend
  const { data: teas, isLoading, isError } = useGetTeasQuery();
  console.log(teas);
  return (
    <section className="flex gap-x-20 px-18">
      {/* Filters */}
      <div className="max-w-54 w-full">
        <SelectionFilters />
        <OrganicToggle />
      </div>

      {/* Products */}
      <div className="max-w-210">
        <button className="text-sm flex gap-6 justify-end mb-5 cursor-pointer hover:outline-1">
          SORT BY
          <svg
            className="self-center"
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8.37498L0 2.37498L1.4 0.974976L6 5.57498L10.6 0.974976L12 2.37498L6 8.37498Z"
              fill="#282828"
            />
          </svg>
        </button>

        {/* Loading / Error states */}
        {isLoading && <p>Loading teas...</p>}
        {isError && <p className="text-red-500">Failed to load teas.</p>}

        {/* Grid of teas */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teas && teas.length > 0 ? (
              teas.map((product) => (
                <ItemCard
                  key={product._id} // assuming MongoDB ID
                  id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  weight={product.weight}
                />
              ))
            ) : (
              <p>No teas found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
