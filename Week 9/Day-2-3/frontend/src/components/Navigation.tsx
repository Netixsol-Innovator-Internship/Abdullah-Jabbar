"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useLogoutMutation } from "../store/api/authApi";
import { logout as logoutAction } from "../store/slices/authSlice";

export default function Navigation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutAction());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span
              className="text-2xl mr-2"
              role="img"
              aria-label="cricket icon"
            >
              🏏
            </span>
            <h1 className="text-xl font-semibold text-gray-900">
              Cricket Analytics
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <a
                href="/chat"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Chat
              </a>
              <a
                href="/upload"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Upload
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
