"use client";
import React from "react";
import {
  useLoginMutation,
  usePreRegisterMutation,
  useRegisterMutation,
  useResendOtpMutation,
  useMeQuery,
} from "@/lib/api/authApiSlice";
import { setAuthToken, getAuthToken, removeAuthToken } from "@/lib/auth-utils";

// Keys centralized so components don't hardcode strings
export const AUTH_KEYS = {
  token: "auth-token",
  user: "auth-user",
  authenticated: "is-authenticated",
  theme: "auth-theme",
} as const;

export type Role = "user" | "admin" | "super-admin" | string;

export interface AuthUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: Role | Role[]; // backend might send a single value or an array
  roles?: Role[]; // some APIs may send plural 'roles'
  addresses?: Array<{
    label?: string;
    fullName?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    isDefault?: boolean;
  }>;
  loyaltyPoints?: number;
  loyaltyTier?: string;
  isEmailVerified?: boolean;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: unknown;
}

interface AuthContextValue {
  user: AuthUser | null;
  roles: Role[];
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean; // admin or super-admin
  isSuperAdmin: boolean;
  loginLocal: (token: string, userPayload?: AuthUser) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  preRegister: (email: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    otp: string,
    name?: string
  ) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (
    email: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

function extractRoles(user: AuthUser | null): Role[] {
  if (!user) return [];
  const collected: Role[] = [];
  const { role, roles } = user as { role?: Role | Role[]; roles?: Role[] };
  if (Array.isArray(role)) collected.push(...role);
  else if (role) collected.push(role);
  if (Array.isArray(roles)) collected.push(...roles);
  // dedupe preserving order
  return [...new Set(collected)];
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [initialised, setInitialised] = React.useState(false);

  // RTK Query hooks
  const [loginMutation] = useLoginMutation();
  const [preRegisterMutation] = usePreRegisterMutation();
  const [registerMutation] = useRegisterMutation();
  const [resendOtpMutation] = useResendOtpMutation();

  // Only run the query if we have a token
  const { data: profileData, refetch } = useMeQuery(undefined, {
    skip: !token,
  });

  // Update user when profile data changes
  React.useEffect(() => {
    if (profileData) {
      setUser(profileData);
      try {
        localStorage.setItem(AUTH_KEYS.user, JSON.stringify(profileData));
      } catch {
        /* ignore */
      }
    }
  }, [profileData]);

  // Auto-refresh profile if user is logged in but doesn't have complete data
  const hasAttemptedRefresh = React.useRef(false);
  const currentUserRef = React.useRef(user);
  currentUserRef.current = user;

  React.useEffect(() => {
    if (token && !hasAttemptedRefresh.current) {
      // Use a timeout to check the user state after it has settled
      const checkUserTimeout = setTimeout(() => {
        const currentUser = currentUserRef.current;
        if (currentUser) {
          const needsRoleRefresh =
            !currentUser.roles ||
            (Array.isArray(currentUser.roles) &&
              currentUser.roles.length === 0);

          if (needsRoleRefresh) {
            hasAttemptedRefresh.current = true;
            // User is logged in but missing roles, trigger a profile refresh
            refetch()
              .catch(() => {
                // If refetch fails, ensure we still have a valid user object with empty roles
                const user = currentUserRef.current;
                if (user && !user.roles) {
                  const updatedUser = { ...user, roles: [] };
                  setUser(updatedUser);
                  try {
                    localStorage.setItem(
                      AUTH_KEYS.user,
                      JSON.stringify(updatedUser)
                    );
                  } catch {
                    /* ignore */
                  }
                }
              })
              .finally(() => {
                // Reset the flag after some time to allow future refresh attempts if needed
                setTimeout(() => {
                  hasAttemptedRefresh.current = false;
                }, 30000); // 30 seconds
              });
          }
        }
      }, 100); // Small delay to let state settle

      return () => clearTimeout(checkUserTimeout);
    }
  }, [token, refetch, setUser]);

  // hydrate from storage once
  React.useEffect(() => {
    try {
      const storedToken = getAuthToken(); // Use utility function
      const storedUser = localStorage.getItem(AUTH_KEYS.user);
      if (storedToken) setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }
    setInitialised(true);
  }, []);

  const loginLocal = React.useCallback(
    (newToken: string, userPayload?: AuthUser) => {
      setToken(newToken);
      setAuthToken(newToken); // Store in both localStorage and cookies
      try {
        localStorage.setItem(AUTH_KEYS.authenticated, "true");
      } catch {
        /* ignore */
      }
      if (userPayload) {
        setUser(userPayload);
        try {
          localStorage.setItem(AUTH_KEYS.user, JSON.stringify(userPayload));
        } catch {
          /* ignore */
        }
      }
    },
    []
  );

  const logout = React.useCallback(() => {
    setUser(null);
    setToken(null);
    removeAuthToken(); // Remove from both localStorage and cookies
    try {
      localStorage.removeItem(AUTH_KEYS.user);
      localStorage.removeItem(AUTH_KEYS.authenticated);
    } catch {
      /* ignore */
    }
  }, []);

  const refreshProfile = React.useCallback(async () => {
    if (!token) return;
    try {
      await refetch();
    } catch {
      /* ignore */
    }
  }, [token, refetch]);

  // Centralized API wrappers
  const login = React.useCallback(
    async (email: string, password: string) => {
      try {
        const result = await loginMutation({ email, password }).unwrap();
        // Set a stub user immediately so UI (navbar dropdown) recognizes authenticated state
        // Include empty roles array to prevent infinite loading state
        loginLocal(result.access_token, { email, roles: [] });
        return { success: true };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Login failed";
        return { success: false, error: msg };
      }
    },
    [loginMutation, loginLocal]
  );

  const preRegister = React.useCallback(
    async (email: string) => {
      try {
        await preRegisterMutation({ email }).unwrap();
        return { success: true };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed";
        return { success: false, error: msg };
      }
    },
    [preRegisterMutation]
  );

  const register = React.useCallback(
    async (email: string, password: string, otp: string, name?: string) => {
      try {
        const result = await registerMutation({
          email,
          password,
          otp,
          name,
        }).unwrap();
        // success -> token returned
        // Include empty roles array to prevent infinite loading state
        loginLocal(result.access_token, { email, name, roles: [] });
        return { success: true };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Registration failed";
        return { success: false, error: msg };
      }
    },
    [registerMutation, loginLocal]
  );

  const resendOtpFn = React.useCallback(
    async (email: string) => {
      try {
        const result = await resendOtpMutation({ email }).unwrap();
        return {
          success: result.success,
          message: result.message,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to resend";
        return { success: false, error: msg };
      }
    },
    [resendOtpMutation]
  );

  const roles = extractRoles(user);
  const isSuperAdmin = roles.includes("super-admin");
  const isAdmin = isSuperAdmin || roles.includes("admin");
  // Consider authenticated if we have a token; user may still be loading
  const isAuthenticated = !!token;

  const value: AuthContextValue = {
    user,
    roles,
    token,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    loginLocal,
    logout,
    refreshProfile,
    login,
    preRegister,
    register,
    resendOtp: resendOtpFn,
  };

  // Avoid rendering children until initial localStorage read to prevent flicker
  if (!initialised) return null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// Helper guard hooks for conciseness
export function useIsAdmin() {
  return useAuth().isAdmin;
}
export function useIsSuperAdmin() {
  return useAuth().isSuperAdmin;
}
export function useRoles() {
  return useAuth().roles;
}
