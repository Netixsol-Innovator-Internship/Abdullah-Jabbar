"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useI18n } from "@/i18n/i18nContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { t } = useI18n();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-(--card-bg) border-b border-(--card-border) p-4 sticky top-0 z-1000">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold m-0 bg-linear-to-br from-(--primary-color) to-(--secondary-color) bg-clip-text text-transparent">
            Planer&apos;s Mint
          </h2>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex gap-8">
          <Link
            href="/"
            className={`text-(--text-secondary) no-underline font-medium transition-colors duration-300 relative pb-1 hover:text-(--primary-color) ${
              pathname === "/"
                ? "text-(--primary-color) after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-0.5 after:bg-(--primary-color) after:rounded-sm"
                : ""
            }`}
            onClick={closeMobileMenu}
          >
            {t("navbar.faucet")}
          </Link>
          <Link
            href="/dex"
            className={`text-(--text-secondary) no-underline font-medium transition-colors duration-300 relative pb-1 hover:text-(--primary-color) ${
              pathname === "/dex"
                ? "text-(--primary-color) after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-0.5 after:bg-(--primary-color) after:rounded-sm"
                : ""
            }`}
            onClick={closeMobileMenu}
          >
            {t("navbar.dex")}
          </Link>
          <Link
            href="/marketplace"
            className={`text-(--text-secondary) no-underline font-medium transition-colors duration-300 relative pb-1 hover:text-(--primary-color) ${
              pathname === "/marketplace"
                ? "text-(--primary-color) after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-0.5 after:bg-(--primary-color) after:rounded-sm"
                : ""
            }`}
            onClick={closeMobileMenu}
          >
            {t("navbar.marketplace")}
          </Link>
          <Link
            href="/portfolio"
            className={`text-(--text-secondary) no-underline font-medium transition-colors duration-300 relative pb-1 hover:text-(--primary-color) ${
              pathname === "/portfolio"
                ? "text-(--primary-color) after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-0.5 after:bg-(--primary-color) after:rounded-sm"
                : ""
            }`}
            onClick={closeMobileMenu}
          >
            {t("navbar.portfolio")}
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center mr-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="bg-(--background) px-4 py-2 rounded-lg font-mono text-sm">
                {account.substring(0, 6)}...{account.substring(38)}
              </span>
              <button
                onClick={disconnectWallet}
                className="bg-(--danger-color) text-white border-none px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold transition-colors duration-300 hover:bg-red-700"
              >
                {t("common.disconnect")}
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-(--primary-color) text-white border-none px-6 py-2.5 rounded-lg cursor-pointer font-semibold transition-colors duration-300 hover:bg-(--primary-dark)"
            >
              {t("common.connect")}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 bg-transparent border-none cursor-pointer z-1001"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-(--text-primary) transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-(--text-primary) my-1 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-(--text-primary) transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-20 left-0 w-full bg-(--card-bg) border-b border-(--card-border) transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          {/* Mobile Navigation Links */}
          <Link
            href="/"
            className={`text-(--text-secondary) no-underline font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-(--background) ${
              pathname === "/" ? "text-(--primary-color) bg-(--background)" : ""
            }`}
            onClick={closeMobileMenu}
          >
            {t("navbar.faucet")}
          </Link>
          <Link
            href="/dex"
            className={`text-(--text-secondary) no-underline font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-(--background) ${
              pathname === "/dex"
                ? "text-(--primary-color) bg-(--background)"
                : ""
            }`}
            onClick={closeMobileMenu}
          >
            {t("navbar.dex")}
          </Link>
          <Link
            href="/marketplace"
            className={`text-(--text-secondary) no-underline font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-(--background) ${
              pathname === "/marketplace"
                ? "text-(--primary-color) bg-(--background)"
                : ""
            }`}
            onClick={closeMobileMenu}
          >
            {t("navbar.marketplace")}
          </Link>
          <Link
            href="/portfolio"
            className={`text-(--text-secondary) no-underline font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-(--background) ${
              pathname === "/portfolio"
                ? "text-(--primary-color) bg-(--background)"
                : ""
            }`}
            onClick={closeMobileMenu}
          >
            {t("navbar.portfolio")}
          </Link>

          {/* Mobile Theme and Language Switchers */}
          <div className="flex items-center justify-center gap-4 py-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          {/* Mobile Wallet Connection */}
          <div className="pt-2 border-t border-(--card-border)">
            {isConnected ? (
              <div className="flex flex-col gap-2">
                <span className="bg-(--background) px-4 py-2 rounded-lg font-mono text-sm text-center">
                  {account.substring(0, 6)}...{account.substring(38)}
                </span>
                <button
                  onClick={() => {
                    disconnectWallet();
                    closeMobileMenu();
                  }}
                  className="bg-(--danger-color) text-white border-none px-4 py-2.5 rounded-lg cursor-pointer font-semibold transition-colors duration-300 hover:bg-red-700 w-full"
                >
                  {t("common.disconnect")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  connectWallet();
                  closeMobileMenu();
                }}
                className="bg-(--primary-color) text-white border-none px-6 py-2.5 rounded-lg cursor-pointer font-semibold transition-colors duration-300 hover:bg-(--primary-dark) w-full"
              >
                {t("common.connect")}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
