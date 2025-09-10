import productshero from "../assets/products-hero.jpg";

export default function ProductHero() {
  return (
    <section id="products-hero">
      <img src={productshero} alt="" className="w-full object-cover max-h-76" />
      <h5 className=" text-sm text-[#282828] pl-6 sm:pl-10 md:pl-14 lg:pl-18 xl:pl-20 py-6">
        HOME/COLLECTIONS/CHAI
      </h5>
    </section>
  );
}
