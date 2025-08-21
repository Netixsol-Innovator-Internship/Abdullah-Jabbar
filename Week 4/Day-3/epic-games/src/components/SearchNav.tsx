
// components/SearchNav.tsx
import React from 'react';

// You can use a library like 'lucide-react' for icons.
// For simplicity, we'll use a plain SVG here.
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const SearchNav: React.FC = () => {
  return (
    // Main container for the navbar.
    // It has a dark background, full width, and uses flexbox for alignment.
    <nav className=" text-gray-300 py-8">
      <div className=" mx-auto flex items-center gap-6">
        {/* Search bar section on the left */}
        <div className="flex items-center space-x-2 bg-zinc-800 rounded-full px-4 py-3">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search Store"
            className="bg-transparent text-sm text-white focus:outline-none placeholder-gray-300 w-full"
          />
        </div>

        {/* Navigation links section on the right */}
        <div className="flex items-center space-x-6 text-sm font-normal">
          {/*
           * Each link is a div with a hover effect.
           * In a real Next.js app, you would use `<Link href="...">` here.
           * The 'transition-colors' class provides a smooth hover animation.
           */}
          <a
            href="#"
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Discover
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Browse
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            News
          </a>
        </div>
      </div>
    </nav>
  );
};

export default SearchNav;
