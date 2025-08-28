"use client";
import React, { useState } from "react";
import API from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await API.post("/auth/login", { email, password });
    console.log(res.data);
    alert("Login successful!");
    localStorage.setItem("accessToken", res.data.accessToken);
    router.push("/");
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full p-2 border rounded"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}
