"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Import language files
import enTranslations from "./en.json";
import esTranslations from "./es.json";
import frTranslations from "./fr.json";

// Available languages
export const languages = {
  en: { name: "English", flag: "🇺🇸", translations: enTranslations },
  es: { name: "Español", flag: "🇪🇸", translations: esTranslations },
  fr: { name: "Français", flag: "🇫🇷", translations: frTranslations },
};

export type Language = keyof typeof languages;

// Type for the i18n context
interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
  getLanguageName: (lang: Language) => string;
  getLanguageFlag: (lang: Language) => string;
  availableLanguages: Language[];
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider component
export const I18nProvider = ({ children }: { children: ReactNode }) => {
  // IMPORTANT: Always initialize with "en" to ensure server and client match initially
  const [language, setLanguage] = useState<Language>("en");
  // Track if we're mounted on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);

    // Now that we're on the client side, we can safely access localStorage
    const storedLanguage = localStorage.getItem("language") as Language | null;
    if (storedLanguage && Object.keys(languages).includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }

    // Add event listener to sync language changes across tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "language" &&
        e.newValue &&
        Object.keys(languages).includes(e.newValue as Language)
      ) {
        setLanguage(e.newValue as Language);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to get translation for a given key
  const t = (key: string): string => {
    try {
      // Split the key path (e.g., 'navbar.home' => ['navbar', 'home'])
      const path = key.split(".");
      let translation: Record<string, unknown> =
        languages[language].translations;

      // Navigate through the nested object to find the translation
      for (const part of path) {
        if (translation[part] === undefined) {
          console.warn(
            `Translation missing for key: ${key} in language ${language}`
          );
          return key; // Return the key itself as fallback
        }
        translation = translation[part] as Record<string, unknown>;
      }

      if (typeof translation === "string") {
        return translation;
      } else {
        console.warn(
          `Invalid translation for key: ${key} in language ${language}`
        );
        return key;
      }
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return key; // Return the key itself as fallback
    }
  };

  // Function to change language
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);

    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      // Update HTML lang attribute
      document.documentElement.lang = lang;
    }
  }; // Get language name
  const getLanguageName = (lang: Language) => languages[lang].name;

  // Get language flag
  const getLanguageFlag = (lang: Language) => languages[lang].flag;

  // Get available languages
  const availableLanguages = Object.keys(languages) as Language[];

  const value = {
    // Always use "en" during server-side rendering to ensure consistent hydration
    language: isClient ? language : "en",
    t,
    changeLanguage,
    getLanguageName,
    getLanguageFlag,
    availableLanguages,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// Custom hook to use the i18n context
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
