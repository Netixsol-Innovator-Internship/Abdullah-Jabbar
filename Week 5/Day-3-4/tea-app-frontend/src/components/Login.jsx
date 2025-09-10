// Login.jsx
import React, { useState } from "react";
import { useLoginMutation } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, { isLoading, error }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData).unwrap();
      console.log("Login successful:", result);

      // Store JWT token + role + email
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      localStorage.setItem("email", result.user.email);

      console.log(result.role);

      // Redirect based on role
      if (result?.role === "admin" || result?.role === "super-admin") {
        navigate("/admin");
      } else {
        navigate("/"); // default route for normal users
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
    >
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Login</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your credentials below</p>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-black focus:ring focus:ring-gray-300 p-3 transition"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-black focus:ring focus:ring-gray-300 p-3 transition"
          required
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm text-center">
          {error.data?.message || "Error logging in"}
        </p>
      )}

      {/* Sign up link */}
      <p className="text-sm text-gray-600 text-center">
        Not registered yet?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-gray-900 font-medium hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  </div>
);


}
