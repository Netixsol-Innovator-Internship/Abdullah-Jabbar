import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import { authAPI } from "../services/api.js"; // <-- use authAPI

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    try {
      const data = await authAPI.login(payload.email, payload.password); // <-- use authAPI
      if (!data?.token) throw new Error("No token returned from API");
      localStorage.setItem("token", data.token);
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Request failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline text-sm"
          >
            Need an account? Register
          </button>
        </div>

        {loading && (
          <div className="mt-4 text-center text-gray-500 text-sm">
            Processing...
          </div>
        )}
      </div>
    </div>
  );
}
