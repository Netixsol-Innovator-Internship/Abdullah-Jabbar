"use client";

import React, { useState } from "react";
import API from "../../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const res = await API.post("/auth/register", { username, email, password });
      console.log(res.data);
      alert("Registration successful!");
      localStorage.setItem("accessToken", res.data.accessToken);
      router.push("/");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h1>
        <p className="text-center text-gray-600 mb-6">Get started with your new account</p>
        
        <form onSubmit={submit} className="space-y-5">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p>Already have an account? 
            <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline ml-1">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}