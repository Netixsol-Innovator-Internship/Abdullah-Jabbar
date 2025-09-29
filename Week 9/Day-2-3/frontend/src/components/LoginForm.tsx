"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "../store/api/authApi";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/slices/authSlice";
import Spinner from "./Spinner";
import { useAppSelector } from "../store/hooks";

// Helper function to safely render error messages
const renderErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    return (error.data as { message?: string })?.message ?? "Login failed";
  }
  return "Login failed";
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  // If already authenticated, redirect to /chat inside an effect to avoid
  // calling router.push during render (React warns when a different
  // component is updated during render).
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({ user: result.user, token: result.access_token })
      );
      router.push("/chat");
    } catch (err) {
      // Better error logging: show structured info when available
      try {
        console.error("Login failed:", JSON.stringify(err));
      } catch {
        console.error("Login failed:", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error ? (
            <div className="text-red-600 text-sm text-center">
              {renderErrorMessage(error)}
            </div>
          ) : null}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size="sm" colorClassName="text-white" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/register"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Don&apos;t have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
