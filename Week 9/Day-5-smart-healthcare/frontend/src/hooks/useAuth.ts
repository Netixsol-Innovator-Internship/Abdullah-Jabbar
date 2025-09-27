"use client";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { User } from "../types";
import { authApi } from "../services/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    const userData = Cookies.get("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        Cookies.remove("auth_token");
        Cookies.remove("user");
      }
    }
    setInitializing(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });

      Cookies.set("auth_token", response.access_token, { expires: 1 });
      Cookies.set("user", JSON.stringify(response.user), { expires: 1 });

      setUser(response.user);
      toast.success("Login successful!");
    } catch (error: unknown) {
      const message =
        error instanceof Error && (error as any).response?.data?.message
          ? (error as any).response.data.message
          : "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setLoading(true);
      const response = await authApi.signup(userData);

      Cookies.set("auth_token", response.access_token, { expires: 1 });
      Cookies.set("user", JSON.stringify(response.user), { expires: 1 });

      setUser(response.user);
      toast.success("Account created successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error && (error as any).response?.data?.message
          ? (error as any).response.data.message
          : "Signup failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: { user, loading, initializing, login, signup, logout },
    },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
