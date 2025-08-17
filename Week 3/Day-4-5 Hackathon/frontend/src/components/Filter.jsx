import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi"; // plus/minus icons

const FilterDropdown = ({ title, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="border-b border-gray-300 mb-4">
      {/* Heading */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="uppercase flex justify-between items-center w-full py-3 text-left text-base font-semibold text-gray-700">
            
        {title}
        {isOpen ? <FiMinus /> : <FiPlus />}
      </button>

      {/* Checkbox options */}
      {isOpen && (
        <ul >
          {options.map((option, index) => (
            <li key={index} className="flex items-center pb-1">
              <input
                type="checkbox"
                id={`${title}-${index}`}
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
                className="mr-2 accent-gray-700"
              />
              <label htmlFor={`${title}-${index}`} className="text-gray-600">
                {option}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterDropdown;
