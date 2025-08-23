// src/components/Header.jsx

import { useNavigate } from "react-router-dom";

export default function Header({ onCartClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/products"); // route for collections/accessories/blog/contact
  };

  const handleClickUser = () => {
    navigate("/login"); // route for user login
  };

  const handleClickLogo = () => {
    navigate("/"); // route for logo click
  };

  const role = localStorage.getItem("role"); // get role from localStorage

  return (
    <header className="w-full max-w-320 mx-auto px-4 py-4 sm:px-8 md:px-18 md:py-7.5 flex items-center justify-between">
      {/* Left: Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={handleClickLogo}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 md:w-9 md:h-9"
        >
          <path
            d="M16 36V20.05C13.8667 20.05 11.8167 19.6413 9.85 18.824C7.88333 18.008 6.15 16.85 4.65 15.35C3.15 13.85 2 12.1167 1.2 10.15C0.4 8.18333 0 6.13333 0 4V0H4C6.1 0 8.13333 0.408 10.1 1.224C12.0667 2.04133 13.8 3.2 15.3 4.7C16.3333 5.73333 17.192 6.86667 17.876 8.1C18.5587 9.33333 19.0833 10.65 19.45 12.05C19.6167 11.8167 19.8 11.592 20 11.376C20.2 11.1587 20.4167 11.9333 20.65 10.7C22.15 9.2 23.8833 8.04133 25.85 7.224C27.8167 6.408 29.8667 6 32 6H36V10C36 12.1333 35.592 14.1833 34.776 16.15C33.9587 18.1167 32.8 19.85 31.3 21.35C29.8 22.85 28.0747 24 26.124 24.8C24.1747 25.6 22.1333 26 20 26V36H16Z"
            fill="#282828"
          />
        </svg>
        <span className="text-base md:text-lg font-semibold font-prosto">
          Brand Name
        </span>
      </div>

      {/* Center: Navigation - Hidden on mobile, visible on medium screens */}
      <nav className="hidden md:flex space-x-6 lg:space-x-10 text-sm tracking-wide text-gray-700">
        <a href="#" onClick={handleClick} className="hover:underline">
          TEA COLLECTIONS
        </a>
        <a href="#" onClick={handleClick} className="hover:underline">
          ACCESSORIES
        </a>
        <a href="#" onClick={handleClick} className="hover:underline">
          BLOG
        </a>
        <a href="#" onClick={handleClick} className="hover:underline">
          CONTACT US
        </a>

        {/* Conditionally render Dashboard */}
        {(role === "admin" || role === "super-admin") && (
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin");
            }}
            className="hover:underline"
          >
            DASHBOARD
          </a>
        )}
      </nav>

      {/* Mobile Menu Button - Visible only on mobile */}
      <button className="md:hidden p-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
            fill="#282828"
          />
        </svg>
      </button>

      {/* Right: Icons - Hidden on mobile, visible on medium screens */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
        {/* Search */}
        <button className="cursor-pointer p-1 hover:opacity-70">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.371 1.888 11.113C0.629333 9.85433 0 8.31667 0 6.5C0 4.68333 0.629333 3.14567 1.888 1.887C3.146 0.629 4.68333 0 6.5 0C8.31667 0 9.85433 0.629 11.113 1.887C12.371 3.14567 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5627 8.81267 11 7.75 11 6.5C11 5.25 10.5627 4.18733 9.688 3.312C8.81267 2.43733 7.75 2 6.5 2C5.25 2 4.18733 2.43733 3.312 3.312C2.43733 4.18733 2 5.25 2 6.5C2 7.75 2.43733 8.81267 3.312 9.688C4.18733 10.5627 5.25 11 6.5 11Z"
              fill="#282828"
            />
          </svg>
        </button>

        {/* User */}
        <button
          className="cursor-pointer p-1 hover:opacity-70"
          onClick={handleClickUser}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.146 12.1123 0.438 11.637C0.729334 11.1623 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64567 4.75 9.387C5.81667 9.129 6.9 9 8 9C9.1 9 10.1833 9.129 11.25 9.387C12.3167 9.64567 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2707 11.1623 15.562 11.637C15.854 12.1123 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9543 12.85 13.863 12.7C13.771 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5623 10.775 11.337C9.85833 11.1123 8.93333 11 8 11C7.06667 11 6.14167 11.1123 5.225 11.337C4.30833 11.5623 3.4 11.9 2.5 12.35C2.35 12.4333 2.22933 12.55 2.138 12.7C2.046 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.021 5.804 9.413 5.412C9.80433 5.02067 10 4.55 10 4C10 3.45 9.80433 2.97933 9.413 2.588C9.021 2.196 8.55 2 8 2C7.45 2 6.97933 2.196 6.588 2.588C6.196 2.97933 6 3.45 6 4C6 4.55 6.196 5.02067 6.588 5.412C6.97933 5.804 7.45 6 8 6Z"
              fill="black"
            />
          </svg>
        </button>

        {/* Cart */}
        <button
          className="cursor-pointer p-1 hover:opacity-70"
          onClick={onCartClick}
        >
          <svg
            width="18"
            height="21"
            viewBox="0 0 18 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 21C1.45 21 0.979 20.8043 0.587 20.413C0.195667 20.021 0 19.55 0 19V7C0 6.45 0.195667 5.97933 0.587 5.588C0.979 5.196 1.45 5 2 5H4C4 3.61667 4.48767 2.43733 5.463 1.462C6.43767 0.487333 7.61667 0 9 0C10.3833 0 11.5627 0.487333 12.538 1.462C13.5127 2.43733 14 3.61667 14 5H16C16.55 5 17.021 5.196 17.413 5.588C17.8043 5.97933 18 6.45 18 7V19C18 19.55 17.8043 20.021 17.413 20.413C17.021 20.8043 16.55 21 16 21H2ZM2 19H16V7H2V19ZM9 13C10.3833 13 11.5627 12.5123 12.538 11.537C13.5127 10.5623 14 9.38333 14 8H12C12 8.83333 11.7083 9.54167 11.125 10.125C10.5417 10.7083 9.83333 11 9 11C8.16667 11 7.45833 10.7083 6.875 10.125C6.29167 9.54167 6 8.83333 6 8H4C4 9.38333 4.48767 10.5623 5.463 11.537C6.43767 12.5123 7.61667 13 9 13ZM6 5H12C12 4.16667 11.7083 3.45833 11.125 2.875C10.5417 2.29167 9.83333 2 9 2C8.16667 2 7.45833 2.29167 6.875 2.875C6.29167 3.45833 6 4.16667 6 5Z"
              fill="#282828"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
