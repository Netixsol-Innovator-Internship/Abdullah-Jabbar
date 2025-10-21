"use client";

import { useState } from "react";
import { useI18n, Language } from "@/i18n/i18nContext";
import { IoLanguageOutline } from "react-icons/io5";

export default function LanguageSwitcher() {
  const {
    language,
    changeLanguage,
    getLanguageName,
    getLanguageFlag,
    availableLanguages,
  } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <IoLanguageOutline className="language-icon" />
        {/* <span className="current-language">
          {getLanguageFlag(language)} {getLanguageName(language)}
        </span> */}
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              className={`language-option ${language === lang ? "active" : ""}`}
              onClick={() => handleLanguageChange(lang)}
            >
              <span className="language-flag">{getLanguageFlag(lang)}</span>
              <span className="language-name">{getLanguageName(lang)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
