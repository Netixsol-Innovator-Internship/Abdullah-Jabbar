"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type ThemeMode = "dark" | "light";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with dark theme as default
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get theme from local storage, default to dark if not set
    const storedTheme = localStorage.getItem("theme") as ThemeMode | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
    // If no stored theme, keep the default "dark" theme
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Update the document's data-theme attribute
    document.documentElement.setAttribute("data-theme", theme);
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
