// Selection.jsx
import ItemCard from "./ItemCard";
import Items from "./itemsData";
import SelectionFilters from "./SelectionFilters";
import OrganicToggle from "./OrganicFilter";

export default function Selection() {
  return (
    <section className="flex gap-x-20 px-18">
      {/* Filters */}
      <div className="max-w-54 w-full">
          <SelectionFilters />
         <OrganicToggle/>
          
      </div>

      {/* Products */}
      <div className="max-w-210 ">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {Items.map((product, index) => (
            <ItemCard
              key={index}
              image={product.image}
              name={product.name}
              price={product.price}
              weight={product.weight}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
