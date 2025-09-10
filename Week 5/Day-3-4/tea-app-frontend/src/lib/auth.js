// tea-app-frontend/src/lib/auth.js
import API from "./api";

// Check if user is logged into the tea-app system
export const isTeaAppAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Check if user is authenticated with the NestJS reviews backend
export const isReviewsAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

// For testing purposes - you should replace this with proper authentication
export const loginTestUser = async () => {
  try {
    const response = await API.post("/auth/login", {
      email: "test@example.com",
      password: "password123",
    });

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data;
    }

    throw new Error("No access token received");
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Login with tea-app credentials to get comments backend access
export const loginWithTeaAppUser = async () => {
  try {
    // Check if we have a tea-app token
    const teaAppToken = getTeaAppToken();

    if (!teaAppToken) {
      throw new Error("No tea-app token found. Please login first.");
    }

    // Get user info from tea-app backend first
    const teaAppBase =
      import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
    const teaAppResponse = await fetch(`${teaAppBase}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${teaAppToken}`,
      },
    });

    if (!teaAppResponse.ok) {
      throw new Error("Tea-app token is invalid or expired");
    }

    const teaAppUser = await teaAppResponse.json();

    // Now try to login/register this user in the NestJS backend
    try {
      // First try to login with existing credentials
      const loginResponse = await API.post("/auth/login", {
        email: teaAppUser.email,
        password: "bridge_password_123", // Default password for bridged accounts
      });

      if (loginResponse.data.accessToken) {
        localStorage.setItem("accessToken", loginResponse.data.accessToken);
        return loginResponse.data;
      }
    } catch {
      // If login fails, try to register the user
      console.log("User doesn't exist in NestJS backend, creating account...");

      try {
        const registerResponse = await API.post("/auth/register", {
          username: teaAppUser.name || teaAppUser.email.split("@")[0],
          email: teaAppUser.email,
          password: "bridge_password_123", // Default password for bridged accounts
        });

        if (registerResponse.data.accessToken) {
          localStorage.setItem(
            "accessToken",
            registerResponse.data.accessToken
          );
          return registerResponse.data;
        }
      } catch (registerError) {
        console.error(
          "Failed to register user in NestJS backend:",
          registerError
        );
        throw registerError;
      }
    }

    throw new Error("Failed to authenticate with reviews backend");
  } catch (error) {
    console.error("Failed to authenticate with reviews backend:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  // Note: We don't remove the tea-app token as that's managed by the tea-app
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const getTeaAppToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Get current user info
export const getCurrentUser = async () => {
  const teaAppToken = getTeaAppToken();
  const commentsToken = getToken();

  if (commentsToken) {
    try {
      // Get user info from NestJS backend
      const response = await API.get("/users/me");
      return {
        ...response.data,
        isReviewsEnabled: true,
      };
    } catch (error) {
      console.error("Failed to get user from NestJS backend:", error);
      // Fall back to tea-app user info
      if (teaAppToken) {
        try {
          const teaAppBase =
            import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
          const teaAppResponse = await fetch(`${teaAppBase}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${teaAppToken}`,
            },
          });

          if (teaAppResponse.ok) {
            const teaAppUser = await teaAppResponse.json();
            return {
              _id: "tea-app-user",
              username: teaAppUser.name || teaAppUser.email.split("@")[0],
              email: teaAppUser.email,
              isReviewsEnabled: false,
            };
          }
        } catch (teaAppError) {
          console.error("Failed to get tea-app user info:", teaAppError);
        }
      }
    }
  } else if (teaAppToken) {
    try {
      const teaAppBase =
        import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
      const teaAppResponse = await fetch(`${teaAppBase}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${teaAppToken}`,
        },
      });

      if (teaAppResponse.ok) {
        const teaAppUser = await teaAppResponse.json();
        return {
          _id: "tea-app-user",
          username: teaAppUser.name || teaAppUser.email.split("@")[0],
          email: teaAppUser.email,
          isReviewsEnabled: false,
        };
      }
    } catch (error) {
      console.error("Failed to get tea-app user info:", error);
    }
  }

  return null;
};
