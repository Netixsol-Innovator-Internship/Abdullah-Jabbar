// src/components/ProductCard.jsx
const ProductCard = ({ image, name }) => {
  return (
    <div className="flex flex-col items-center overflow-hidden ">
      <div className="w-full h-full">
        <img
          src={image}
          alt={name}
           className="
   object-cover 
    w-90 h-90           /* desktop */
    md:-w-80 md:-h-80     /* tablet */
    sm:-w-70 sm:-h-70     /* mobile */
  "
/>
    
      </div>
      <p className="py-2 md:py-4 lg:py-6 text-center text-base font-medium">{name}</p>
    </div>
  );
};

export default ProductCard;
