import React, { useState } from "react";
import { useSignupMutation } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [signup, { isLoading, error }] = useSignupMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [nameWarning, setNameWarning] = useState(""); // for polite warning

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // live validation only for name
    if (name === "name") {
      if (value.length > 30) {
        setNameWarning("Your name is too long. Please keep it under 30 characters.");
      } else {
        setNameWarning(""); // clear warning when within limit
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prevent submission if name exceeds limit
    if (formData.name.length > 30) {
      setNameWarning("Please shorten your name before signing up.");
      return;
    }

    try {
      const result = await signup(formData).unwrap();
      console.log("Signup successful:", result);
      localStorage.setItem("user", result);

      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
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
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-1 text-sm text-gray-500">Sign up to get started</p>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-black focus:ring focus:ring-gray-300 p-3 transition"
            required
          />
          {/* Polite warning message */}
          {nameWarning && (
            <p className="mt-1 text-xs text-red-500">{nameWarning}</p>
          )}
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
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error.data?.message || "Error signing up"}
          </p>
        )}

        {/* Link to Login page */}
        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-gray-900 font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
