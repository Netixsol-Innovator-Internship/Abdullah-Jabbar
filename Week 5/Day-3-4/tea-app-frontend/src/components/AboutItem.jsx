import React from 'react';

// You will need to import icons to match the design.
// For this example, we'll use inline SVGs as placeholders.

/**
 * A reusable component to display a key-value pair, like 'Flavor' and 'Spicy'.
 * @param {object} props The component props.
 * @param {string} props.title The title of the item (e.g., 'FLAVOR').
 * @param {string} props.value The value associated with the title (e.g., 'Spicy').
 * @returns {JSX.Element} The AboutItem component.
 */
const AboutItem = ({ title, value }) => {
  return (
    <div className="flex flex-wrap flex-col items-start px-2 sm:px-4 md:px-6 lg:px-8 py-4 border-r border-gray-200 last:border-r-0 h-full">
      <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">
        {title}
      </span>
      <span className="mt-1 text-base text-gray-800 capitalize">
        {value}
      </span>
    </div>
  );
};

/**
 * A reusable component to display a steeping instruction with an icon and value.
 * @param {object} props The component props.
 * @param {string} props.title The title of the instruction (e.g., 'SERVING SIZE').
 * @param {string} props.value The value associated with the title (e.g., '2 tsp per cup').
 * @param {JSX.Element} props.icon The icon element for the instruction.
 * @returns {JSX.Element} The SteepingInstruction component.
 */
const SteepingInstruction = ({ title, value, icon }) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-6 h-6 text-gray-800 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex gap-x-3">
        <span className="text-sm font-medium text-gray-800 uppercase tracking-wide">
          {title}
        </span>
        <span className="text-sm text-gray-600">
          {value}
        </span>
      </div>
    </div>
  );
};

/**
 * The main container component that combines the steeping instructions
 * and the tea details into a single layout, named AboutContainer.
 * @returns {JSX.Element} The AboutContainer component.
 */
const AboutContainer = () => {
  // SVG icons for the steeping instructions
  const servingSizeIcon = (
 <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 17V4L0 0H15V3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V10C19 10.55 18.8042 11.0208 18.4125 11.4125C18.0208 11.8042 17.55 12 17 12H15V17H3ZM5 15H13V2H4L5 3.3V15ZM15 10H17V5H15V10ZM9 14H12V3H9V14ZM0 20V18H18V20H0Z" fill="#282828"/>
</svg>

  );

  const temperatureIcon = (
    <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 11.8C0 10.1333 0.6625 8.32083 1.9875 6.3625C3.3125 4.40417 5.31667 2.28333 8 0C9.96667 1.66667 11.5625 3.25 12.7875 4.75C14.0125 6.25 14.8917 7.675 15.425 9.025H13.25C12.7833 8.075 12.1167 7.07083 11.25 6.0125C10.3833 4.95417 9.3 3.83333 8 2.65C6.01667 4.46667 4.52083 6.14167 3.5125 7.675C2.50417 9.20833 2 10.5833 2 11.8C2 13.5833 2.56667 15.0625 3.7 16.2375C4.83333 17.4125 6.26667 18 8 18V20C5.71667 20 3.8125 19.2167 2.2875 17.65C0.7625 16.0833 0 14.1333 0 11.8ZM10.8 20.475L10.375 19.525C10.2417 19.2417 10.1458 18.9458 10.0875 18.6375C10.0292 18.3292 10 18.0167 10 17.7C10 17.3333 10.0417 16.9708 10.125 16.6125C10.2083 16.2542 10.3333 15.9083 10.5 15.575C10.6333 15.2917 10.75 15.0042 10.85 14.7125C10.95 14.4208 11 14.1167 11 13.8C11 13.55 10.9708 13.3083 10.9125 13.075C10.8542 12.8417 10.775 12.6083 10.675 12.375L10.325 11.625L11.7 11.025L12.125 11.925C12.2583 12.2083 12.3542 12.5083 12.4125 12.825C12.4708 13.1417 12.5 13.4667 12.5 13.8C12.5 14.1667 12.4583 14.525 12.375 14.875C12.2917 15.225 12.1667 15.5667 12 15.9C11.8667 16.1833 11.75 16.475 11.65 16.775C11.55 17.075 11.5 17.3833 11.5 17.7C11.5 17.9333 11.525 18.1625 11.575 18.3875C11.625 18.6125 11.7 18.8333 11.8 19.05L12.175 19.875L10.8 20.475ZM13.8 20.475L13.375 19.525C13.2417 19.2417 13.1458 18.9458 13.0875 18.6375C13.0292 18.3292 13 18.0167 13 17.7C13 17.3333 13.0417 16.9708 13.125 16.6125C13.2083 16.2542 13.3333 15.9083 13.5 15.575C13.6333 15.2917 13.75 15.0042 13.85 14.7125C13.95 14.4208 14 14.1167 14 13.8C14 13.55 13.9708 13.3083 13.9125 13.075C13.8542 12.8417 13.775 12.6083 13.675 12.375L13.325 11.625L14.7 11.025L15.125 11.925C15.2583 12.225 15.3542 12.5292 15.4125 12.8375C15.4708 13.1458 15.5 13.4667 15.5 13.8C15.5 14.1667 15.4583 14.525 15.375 14.875C15.2917 15.225 15.1667 15.5667 15 15.9C14.8667 16.1833 14.75 16.475 14.65 16.775C14.55 17.075 14.5 17.3833 14.5 17.7C14.5 17.9333 14.525 18.1625 14.575 18.3875C14.625 18.6125 14.7 18.8333 14.8 19.05L15.175 19.875L13.8 20.475ZM16.8 20.475L16.375 19.525C16.2417 19.2417 16.1458 18.9458 16.0875 18.6375C16.0292 18.3292 16 18.0167 16 17.7C16 17.3333 16.0417 16.9708 16.125 16.6125C16.2083 16.2542 16.3333 15.9083 16.5 15.575C16.6333 15.2917 16.75 15.0042 16.85 14.7125C16.95 14.4208 17 14.1167 17 13.8C17 13.55 16.9708 13.3083 16.9125 13.075C16.8542 12.8417 16.775 12.6083 16.675 12.375L16.325 11.625L17.7 11.025L18.125 11.925C18.2583 12.2083 18.3542 12.5083 18.4125 12.825C18.4708 13.1417 18.5 13.4667 18.5 13.8C18.5 14.1667 18.4583 14.5292 18.375 14.8875C18.2917 15.2458 18.1667 15.5917 18 15.925C17.8667 16.2083 17.75 16.4958 17.65 16.7875C17.55 17.0792 17.5 17.3833 17.5 17.7C17.5 17.9333 17.525 18.1625 17.575 18.3875C17.625 18.6125 17.7 18.8333 17.8 19.05L18.175 19.875L16.8 20.475Z" fill="#282828"/>
</svg>

  );

  const timeIcon = (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.0001 20C9.7501 20 8.57927 19.7625 7.4876 19.2875C6.39593 18.8125 5.44593 18.1708 4.6376 17.3625C3.82926 16.5541 3.1876 15.6041 2.7126 14.5125C2.2376 13.4208 2.0001 12.25 2.0001 11C2.0001 9.74998 2.2376 8.57914 2.7126 7.48748C3.1876 6.39581 3.82926 5.44581 4.6376 4.63748C5.44593 3.82914 6.39593 3.18748 7.4876 2.71248C8.57927 2.23748 9.7501 1.99998 11.0001 1.99998C12.2501 1.99998 13.4209 2.23748 14.5126 2.71248C15.6043 3.18748 16.5543 3.82914 17.3626 4.63748C18.1709 5.44581 18.8126 6.39581 19.2876 7.48748C19.7626 8.57914 20.0001 9.74998 20.0001 11C20.0001 12.25 19.7626 13.4208 19.2876 14.5125C18.8126 15.6041 18.1709 16.5541 17.3626 17.3625C16.5543 18.1708 15.6043 18.8125 14.5126 19.2875C13.4209 19.7625 12.2501 20 11.0001 20ZM13.8001 15.2L15.2001 13.8L12.0001 10.6V5.99998H10.0001V11.4L13.8001 15.2ZM4.6001 0.349976L6.0001 1.74998L1.7501 5.99998L0.350098 4.59998L4.6001 0.349976ZM17.4001 0.349976L21.6501 4.59998L20.2501 5.99998L16.0001 1.74998L17.4001 0.349976ZM11.0001 18C12.9501 18 14.6043 17.3208 15.9626 15.9625C17.3209 14.6041 18.0001 12.95 18.0001 11C18.0001 9.04998 17.3209 7.39581 15.9626 6.03748C14.6043 4.67914 12.9501 3.99998 11.0001 3.99998C9.0501 3.99998 7.39593 4.67914 6.0376 6.03748C4.67926 7.39581 4.0001 9.04998 4.0001 11C4.0001 12.95 4.67926 14.6041 6.0376 15.9625C7.39593 17.3208 9.0501 18 11.0001 18Z" fill="#282828"/>
</svg>

  );

  const colorIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" fill="#BC575F"/>
</svg>

  );

  return (
    <div className="flex p-8 bg-gray-100 mt-10 sm:mt-14 lg:mt-20 w-full h-full space-x-4 px-12">
      {/* Left section for Steeping instructions */}
      <div className="flex flex-col w-1/2">
        <h2 className="text-3xl  text-gray-800 mb-6">Steeping instructions</h2>
        <SteepingInstruction
          title="SERVING SIZE:"
          value="2 tsp per cup, 6 tsp per pot"
          icon={servingSizeIcon}
        />
        <hr className="w-full border-gray-200 my-2" />
        <SteepingInstruction
          title="WATER TEMPERATURE:"
          value="100°C"
          icon={temperatureIcon}
        />
        <hr className="w-full border-gray-200 my-2" />
        <SteepingInstruction
          title="STEEPING TIME:"
          value="3 - 5 minutes"
          icon={timeIcon}
        />
        <hr className="w-full border-gray-200 my-2" />
        <SteepingInstruction
          title="COLOR AFTER 3 MINUTES"
          icon={colorIcon}
        />
      </div>

      {/* Right section for About this tea */}
      <div className="flex flex-col w-1/2 ">
        <h2 className="text-3xl text-gray-800 mb-6">About this tea</h2>
        <div className="flex justify-start flex-wrap items-center space-x-0">
          <AboutItem title="FLAVOR" value="Spicy" />
          <AboutItem title="QUALITIES" value="Smoothing" />
          <AboutItem title="CAFFEINE" value="Medium" />
          <AboutItem title="ALLERGENS" value="Nuts-free" />
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ingredient</h3>
          <p className="text-base text-gray-600">
            Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces.
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the main container component
export default AboutContainer;
