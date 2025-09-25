"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useGetProfileQuery } from "../store/api/authApi";
import { updateUser } from "../store/slices/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {
    data: profileData,
    isLoading,
    error,
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Update Redux store with profile data when loaded
  useEffect(() => {
    if (profileData && !user) {
      dispatch(updateUser(profileData));
    }
  }, [profileData, user, dispatch]);

  useEffect(() => {
    if (!isAuthenticated || error) {
      router.push("/login");
    }
  }, [isAuthenticated, error, router]);

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
