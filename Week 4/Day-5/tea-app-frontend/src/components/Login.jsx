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
    <form onSubmit={handleSubmit} className="space-y-2 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-500 text-white px-4 py-2 w-full"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {error && (
        <p className="text-red-500">
          {error.data?.message || "Error logging in"}
        </p>
      )}

      {/* Sign up link */}
      <p className="text-sm text-gray-600 text-center mt-3">
        Not registered yet?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-green-600 hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
