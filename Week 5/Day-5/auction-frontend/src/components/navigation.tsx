"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // check localStorage for token on mount
    try {
      setHasToken(Boolean(localStorage.getItem("token")));
    } catch {
      setHasToken(false);
    }

    // update when other tabs change auth status
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setHasToken(Boolean(e.newValue));
    };
    window.addEventListener("storage", onStorage);

    // update when same-tab login/register dispatches a custom event
    const onAuthChanged = () =>
      setHasToken(Boolean(localStorage.getItem("token")));
    window.addEventListener("authChanged", onAuthChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged as EventListener);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/car-deposit%20Logo.png"
            alt="Car Deposit logo"
            className="object-contain"
          />
        </Link>

        {/* nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-gray-700 hover:text-[#4A5FBF] ${
              pathname === "/" ? "font-bold text-[#4A5FBF]" : "font-medium"
            }`}
          >
            Home
          </Link>
          <Link
            href="/car-auction"
            className={`text-gray-700 hover:text-[#4A5FBF] ${
              pathname === "/car-auction" ? "font-bold text-[#4A5FBF]" : ""
            }`}
          >
            Car Auction
          </Link>
          <Link
            href="/sell-your-car"
            className={`text-gray-700 hover:text-[#4A5FBF] ${
              pathname === "/sell-your-car" ? "font-bold text-[#4A5FBF]" : ""
            }`}
          >
            Sell Your Car
          </Link>
          <Link
            href="/about"
            className={`text-gray-700 hover:text-[#4A5FBF] ${
              pathname === "/about" ? "font-bold text-[#4A5FBF]" : ""
            }`}
          >
            About us
          </Link>
          <Link
            href="/contact"
            className={`text-gray-700 hover:text-[#4A5FBF] ${
              pathname === "/contact" ? "font-bold text-[#4A5FBF]" : ""
            }`}
          >
            Contact
          </Link>
          {hasToken && (
            <Link
              href="/profile"
              className={`text-gray-700 hover:text-[#4A5FBF] ${
                pathname === "/profile" ? "font-bold text-[#4A5FBF]" : ""
              }`}
            >
              Profile
            </Link>
          )}
        </div>

        {/* icons */}
        <div className="flex items-center gap-4">
          {/* star */}
          <svg
            width="22"
            height="21"
            viewBox="0 0 22 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.5634 7.3L14.5134 6.775L12.1509 1.2125C11.7259 0.2 10.2759 0.2 9.85088 1.2125L7.48838 6.7875L1.45088 7.3C0.350884 7.3875 -0.0991158 8.7625 0.738384 9.4875L5.32588 13.4625L3.95088 19.3625C3.70088 20.4375 4.86338 21.2875 5.81338 20.7125L11.0009 17.5875L16.1884 20.725C17.1384 21.3 18.3009 20.45 18.0509 19.375L16.6759 13.4625L21.2634 9.4875C22.1009 8.7625 21.6634 7.3875 20.5634 7.3ZM11.0009 15.25L6.30088 18.0875L7.55088 12.7375L3.40088 9.1375L8.87588 8.6625L11.0009 3.625L13.1384 8.675L18.6134 9.15L14.4634 12.75L15.7134 18.1L11.0009 15.25Z"
              fill="#2E3D83"
            />
          </svg>

          {/* bell */}
          <svg
            width="22"
            height="24"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 3.25C8.5 2.58696 8.76339 1.95107 9.23223 1.48223C9.70107 1.01339 10.337 0.75 11 0.75C11.663 0.75 12.2989 1.01339 12.7678 1.48223C13.2366 1.95107 13.5 2.58696 13.5 3.25C14.9355 3.92878 16.1593 4.98541 17.0401 6.30662C17.9209 7.62784 18.4255 9.16384 18.5 10.75V14.5C18.5941 15.2771 18.8693 16.0213 19.3035 16.6727C19.7377 17.324 20.3188 17.8643 21 18.25H1C1.68117 17.8643 2.26226 17.324 2.69648 16.6727C3.13071 16.0213 3.40593 15.2771 3.5 14.5V10.75C3.57445 9.16384 4.07913 7.62784 4.95994 6.30662C5.84075 4.98541 7.06449 3.92878 8.5 3.25M7.25 18.25V19.5C7.25 20.4946 7.64509 21.4484 8.34835 22.1517C9.05161 22.8549 10.0054 23.25 11 23.25C11.9946 23.25 12.9484 22.8549 13.6517 22.1517C14.3549 21.4484 14.75 20.4946 14.75 19.5V18.25"
              stroke="#2E3D83"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* car drop down */}
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27.5917 8.76454C27.3 7.90413 26.4833 7.29163 25.5208 7.29163H9.47917C8.51667 7.29163 7.71458 7.90413 7.40833 8.76454L4.53542 17.0333C4.43333 17.3395 4.375 17.6604 4.375 17.9958V28.4375C4.375 29.6479 5.35208 30.625 6.5625 30.625C7.77292 30.625 8.75 29.6479 8.75 28.4375V27.7083H26.25V28.4375C26.25 29.6333 27.2271 30.625 28.4375 30.625C29.6333 30.625 30.625 29.6479 30.625 28.4375V17.9958C30.625 17.675 30.5667 17.3395 30.4646 17.0333L27.5917 8.76454ZM9.47917 23.3333C8.26875 23.3333 7.29167 22.3562 7.29167 21.1458C7.29167 19.9354 8.26875 18.9583 9.47917 18.9583C10.6896 18.9583 11.6667 19.9354 11.6667 21.1458C11.6667 22.3562 10.6896 23.3333 9.47917 23.3333ZM25.5208 23.3333C24.3104 23.3333 23.3333 22.3562 23.3333 21.1458C23.3333 19.9354 24.3104 18.9583 25.5208 18.9583C26.7313 18.9583 27.7083 19.9354 27.7083 21.1458C27.7083 22.3562 26.7313 23.3333 25.5208 23.3333ZM7.29167 16.0416L9.14375 10.4708C9.34792 9.88746 9.90208 9.47913 10.5292 9.47913H24.4708C25.0979 9.47913 25.6521 9.88746 25.8563 10.4708L27.7083 16.0416H7.29167Z"
              fill="#2E3D83"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
}
