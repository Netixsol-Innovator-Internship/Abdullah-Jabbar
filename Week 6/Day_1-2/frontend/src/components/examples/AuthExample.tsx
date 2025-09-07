"use client";

import React from "react";
import {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
} from "@/lib/api/authApiSlice";

export default function AuthExample() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isRegister, setIsRegister] = React.useState(false);

  // RTK Query hooks
  const [login, { isLoading: isLoggingIn, error: loginError }] =
    useLoginMutation();
  const [register, { isLoading: isRegistering, error: registerError }] =
    useRegisterMutation();

  // Get user profile
  const { data: user, isLoading: isLoadingUser } = useMeQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegister) {
        await register({ email, password, otp, name }).unwrap();
      } else {
        await login({ email, password }).unwrap();
      }

      // Clear form
      setEmail("");
      setPassword("");
      setName("");
      setOtp("");
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {user ? (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h2 className="text-xl font-bold mb-4">
            Welcome, {user.name || user.email}
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.name && (
              <p>
                <strong>Name:</strong> {user.name}
              </p>
            )}
            {user.roles && (
              <p>
                <strong>Roles:</strong>{" "}
                {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">
            {isRegister ? "Register" : "Login"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            {isRegister && (
              <>
                <div>
                  <label htmlFor="name" className="block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label htmlFor="otp" className="block mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}

            {(loginError || registerError) && (
              <div className="text-red-500">
                {JSON.stringify(loginError || registerError)}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || isRegistering}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoggingIn || isRegistering
                ? "Processing..."
                : isRegister
                  ? "Register"
                  : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-500 hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </>
      )}
    </div>
  );
}
