import { useState } from "react";

export default function OrganicToggle() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-base font-semibold text-gray-700">ORGANIC</span>
      <button
        type="button"
        onClick={handleToggle}
        className={`ml-4 relative inline-flex flex-shrink-0 h-3.5 w-7 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200 outline-1 ${
          isOn ? "bg-gray-400" : "bg-gray-100"
        }`}
        role="switch"
        aria-checked={isOn}
      >
        <span className="sr-only">Toggle organic</span>
        <span
          aria-hidden="true"
          className={`inline-block h-3 w-3 rounded-full bg-black shadow transform ring-0 transition-transform duration-200 ${
            isOn ? "translate-x-3" : "translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
}
