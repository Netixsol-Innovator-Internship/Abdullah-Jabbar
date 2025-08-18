import Items from "./itemsData";
import ItemCard from "./ItemCard";

const Recommended = () => {
  return (
    <section className=" max-w-210 mx-auto my-20">
      <h1 className="text-3xl text-center font-prosto">You may also like</h1>

      <div className="pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {Items.slice(-3).map((product, index) => (
          <ItemCard
            key={index}
            image={product.image}
            name={product.name}
            price={product.price}
            weight={product.weight}
          />
        ))}
      </div>
    </section>
  );
};

export default Recommended;
