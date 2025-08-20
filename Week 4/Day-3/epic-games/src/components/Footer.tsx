// components/Footer.tsx
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#202020] text-gray-400 font-inter text-sm max-w-360 mx-auto p-8 ">
      <div className=" w-full mx-auto ">
        {/* Top section: Social icons and back to top */}
        <div className="flex justify-between items-start border-b border-gray-700 pb-8 mb-8">
          {/* Social icons */}
          <div className="flex space-x-4">
            <Link href="#">
              <Image
                src="/facebook.svg"
                alt="facebook logo"
                width={24}
                height={24}
              />
            </Link>

            <Link href="#">
              <Image
                src="/twitter.svg"
                alt="twitter logo"
                width={24}
                height={24}
              />
            </Link>

            <Link href="#">
              <Image
                src="/youtube.svg"
                alt="youtube logo"
                width={24}
                height={24}
              />
            </Link>
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-2 outline-white outline-1 cursor-pointer hover:bg-[#2a2a2a]  transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm mb-1">Resources</p>
        {/* Middle section: Links */}
        <div className="max-w-170.5 grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-white ">
          <div className="w-fit">
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline ">
                  Creator Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Publish on Epic
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Profession
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Company
                </a>
              </li>
            </ul>
          </div>

          <div className=" w-fit">
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Fan Work Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  User Exp Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  User License
                </a>
              </li>
            </ul>
          </div>

          <div className=" w-fit">
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Online Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Epic Newsroom
                </a>
              </li>
            </ul>
          </div>

          <div className=" w-fit">
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Battle Breakers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Fortnite
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Infinity Blade
                </a>
              </li>
            </ul>
          </div>

          <div className=" w-fit">
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Robo Recall
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shadow Complex
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Unreal Tournament
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0">
          <p className="md:w-3/4 lg:w-2/3">
            © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games,
            Epic Games logo, Fortnite, Fortnite logo, Unreal, Unreal Engine,
            Unreal Engine logo, Unreal Tournament ) and the Unreal Tournament
            logo are trademarks or registered trademarks of Epic Games, Inc. in
            the United States of America and elsewhere. Other brand or product
            names are trademarks of their respective owners. Transactions
            outside the United States are handled through Epic Games
            International, S.à r.l..
          </p>

          <Image src="/Logo.svg" alt="Epic Games Logo" width={28} height={28} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
