"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useGetProfileQuery } from "../store/api/authApi";
import { updateUser } from "../store/slices/authSlice";
import FullScreenLoader from "./FullScreenLoader";

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
    console.debug("ProtectedRoute auth state", {
      isAuthenticated,
      isLoading,
      error,
      profileData,
      user,
    });

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
    return <FullScreenLoader label="Authenticating your session" />;
  }

  return <>{children}</>;
}
