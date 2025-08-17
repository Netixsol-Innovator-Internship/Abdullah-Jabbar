import { products } from "./productsData";
import ProductCard from "./ProductCard";

const Collections = () => {
  return (
    <section className="w-full px-18 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Our Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {products.map((product) => (
          <ProductCard key={product.id} name={product.name} image={product.image} />
        ))}
      </div>
    </section>
  );
};

export default Collections;
