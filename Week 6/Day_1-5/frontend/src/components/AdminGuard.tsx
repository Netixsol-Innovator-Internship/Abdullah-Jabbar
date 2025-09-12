"use client";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface AdminGuardProps {
  children: React.ReactNode;
  superOnly?: boolean; // if true requires super-admin specifically
  fallback?: React.ReactNode; // optional custom fallback visual
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  superOnly = false,
  fallback = null,
}) => {
  const { isAuthenticated, isAdmin, isSuperAdmin, user } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Wait a moment for authentication to settle
    const timer = setTimeout(() => {
      setLoading(false);

      if (!isAuthenticated) {
        console.log("AdminGuard: User not authenticated, redirecting to login");
        router.replace("/authForm");
        return;
      }

      // Check role requirements
      if (superOnly) {
        if (isSuperAdmin) {
          console.log("AdminGuard: Super-admin access granted");
          setAllowed(true);
        } else {
          console.log(
            "AdminGuard: Super-admin required, access denied. User roles:",
            user?.roles || user?.role
          );
          router.replace("/?error=super-admin-required");
        }
      } else {
        // Allow both admin and super-admin
        if (isAdmin) {
          console.log("AdminGuard: Admin access granted");
          setAllowed(true);
        } else {
          console.log(
            "AdminGuard: Admin access denied. User roles:",
            user?.roles || user?.role
          );
          router.replace("/?error=admin-required");
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isAdmin, isSuperAdmin, superOnly, router, user]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying access permissions...</p>
          </div>
        </div>
      )
    );
  }

  if (!allowed) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              {superOnly
                ? "Super-admin privileges required to access this area."
                : "Admin privileges required to access the dashboard."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Return to Home
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};
