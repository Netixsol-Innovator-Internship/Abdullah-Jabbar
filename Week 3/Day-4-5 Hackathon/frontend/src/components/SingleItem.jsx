import { useParams } from "react-router-dom";
import  items  from "./itemsData"; // adjust path if needed

const SingleItem = () => {
  const { id } = useParams(); // e.g. if your route is /product/:id
  const product = items[id];  // basic way to pick one by index

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <section className="w-full max-h-141 px-18">
      <p className="text-xs font-medium mb-4">
        HOME / COLLECTIONS / PRODUCTS / {product.name.toUpperCase()}
      </p>

      <div className="flex w-full max-h-127 mt-6 gap-8">
        <img
          src={product.image}
          className="max-w-108 h-full object-cover"
          alt={product.name}
        />

        <div className="flex flex-col flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-gray-100 px-3 py-1 rounded">Origin: {product.origin}</span>
            <span className="bg-gray-100 px-3 py-1 rounded">Flavor: {product.flavor}</span>
            <span className="bg-gray-100 px-3 py-1 rounded">Qualities: {product.qualities}</span>
            <span className="bg-gray-100 px-3 py-1 rounded">{product.caffeine}</span>
            <span className="bg-gray-100 px-3 py-1 rounded">{product.allergens}</span>
            {product.isOrganic && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded">Organic</span>
            )}
          </div>

          <p className="text-xl font-semibold mb-4">{product.price}</p>

          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
            <svg className="w-5 h-5" fill="currentColor">
              <rect width="100%" height="100%" />
            </svg>
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SingleItem;
