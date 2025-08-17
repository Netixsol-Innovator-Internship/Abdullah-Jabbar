// src/components/ItemCard.jsx
import { useNavigate } from "react-router-dom";


 
const ItemCard = ({ image, name, price, weight }) => {
   const navigate = useNavigate();

  const handleClick = () => {
    navigate("/productPage"); // the route you want to redirect to
  };

  return (
    <div onClick={handleClick} className="flex flex-col items-center overflow-hidden mx-auto">
      <div className="w-full h-full">
        <img src={image} alt={name} className="object-cover w-66 h-66" />
      </div>
      <p className="py-2 md:py-4 lg:py-6 text-center text-base font-normal text-gray-600">
        {name}
        <br />
        <span className="text-sm leading-10 text-black">{price} /</span>{" "}
        <span className="text-xs">{weight}</span>
      </p>
    </div>
  );
};


export default ItemCard;
