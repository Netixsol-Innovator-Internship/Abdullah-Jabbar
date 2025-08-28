// src/components/ItemCard.jsx
import { useNavigate } from "react-router-dom";

const ItemCard = ({ id, image, name, price, weight }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to product with id:", id);
    navigate(`/productPage/${ id}`); // the route you want to redirect to
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center overflow-hidden mx-auto"
    >
      <div className="w-full h-full">
        <img
          src={image}
          alt={name}
          className="object-cover w-66 h-66 hover:scale-[1.02] cursor-pointer"
        />
      </div>
      <p className="py-2 md:py-4 lg:py-6 text-center text-base font-normal text-gray-600">
        {name}
        <br />
        <span className="text-sm leading-10 text-black">{price} /</span>{" "}
        <span className="text-xs">{weight} 50g</span>
      </p>
    </div>
  );
};

export default ItemCard;
