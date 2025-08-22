import React, { useState } from "react";
import { useSignupMutation } from "../services/api";
import { useNavigate } from "react-router-dom"; // import useNavigate

export default function Signup() {
  const [signup, { isLoading, error }] = useSignupMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // initialize navigate

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(formData).unwrap();
      console.log("Signup successful:", result);
      localStorage.setItem("user", result);

      // Navigate to /login after successful signup
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Signup</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

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
        className="bg-blue-500 text-white px-4 py-2 w-full"
      >
        {isLoading ? "Signing up..." : "Signup"}
      </button>

      {error && (
        <p className="text-red-500">
          {error.data?.message || "Error signing up"}
        </p>
      )}
    </form>
  );
}
