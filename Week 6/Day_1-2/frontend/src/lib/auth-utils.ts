"use client";

// Utility functions for handling authentication tokens in both localStorage and cookies
export const setAuthToken = (token: string) => {
  // Store in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("auth-token", token);

    // Also store in cookie for middleware access
    document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure=${window.location.protocol === "https:"}`;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth-token");
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-token");
    // Remove cookie by setting expiry in the past
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
  }
};

export const setAuthData = (
  token: string,
  userData?: Record<string, unknown>
) => {
  setAuthToken(token);

  if (userData && typeof window !== "undefined") {
    localStorage.setItem("auth-user", JSON.stringify(userData));
    localStorage.setItem("is-authenticated", "true");
  }
};

export const clearAuthData = () => {
  removeAuthToken();

  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-user");
    localStorage.removeItem("is-authenticated");
  }
};
