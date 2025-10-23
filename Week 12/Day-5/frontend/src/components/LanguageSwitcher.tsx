"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n, Language } from "@/i18n/i18nContext";
import { IoLanguageOutline, IoChevronDown } from "react-icons/io5";
import { MdCheck } from "react-icons/md";

export default function LanguageSwitcher() {
  const {
    language,
    changeLanguage,
    getLanguageName,
    getLanguageFlag,
    availableLanguages,
  } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside or focus shifts
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.relatedTarget as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("focusout", handleFocusOut);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-center gap-1 bg-transparent border border-(--card-border) text-(--text-secondary) rounded-lg w-10.5 h-9.5 transition-all duration-200 hover:border-(--primary-color) hover:bg-[rgba(99,102,241,0.1)] hover:text-(--primary-color)"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <IoLanguageOutline className="text-lg" />
        <IoChevronDown
          className={`text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 min-w-max bg-(--card-bg) border border-(--card-border) rounded-xl overflow-hidden shadow-2xl shadow-black/20 animate-slideDown">
          <div className="py-1">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                className={`flex items-center justify-between gap-4 px-4 py-2.5 w-full text-left transition-all duration-150 ${
                  language === lang
                    ? "bg-[rgba(99,102,241,0.15)] text-(--primary-color)"
                    : "text-(--text-secondary) hover:bg-[rgba(99,102,241,0.1)] hover:text-(--text-primary)"
                }`}
                onClick={() => handleLanguageChange(lang)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getLanguageFlag(lang)}</span>
                  <span className="text-sm">{getLanguageName(lang)}</span>
                </div>
                {language === lang && (
                  <MdCheck className="text-lg text-(--primary-color) shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
