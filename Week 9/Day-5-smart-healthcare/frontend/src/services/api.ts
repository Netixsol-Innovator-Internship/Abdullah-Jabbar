import axios from "axios";
import Cookies from "js-cookie";
import {
  AuthResponse,
  Product,
  SearchFilters,
  ChatMessage,
  PaginatedResponse,
} from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth_token");
      Cookies.remove("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  signup: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
};

export const productsApi = {
  getAll: async (page = 1, limit = 12): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("/products", {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  search: async (
    filters: SearchFilters
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("/products/search", { params: filters });
    return response.data;
  },

  aiSearch: async (query: string): Promise<any> => {
    const response = await api.post("/products/ai-search", { query });
    return response.data;
  },
};

export const aiApi = {
  chat: async (
    message: string,
    productId?: string
  ): Promise<{
    response: string;
    suggestedProducts: Product[];
  }> => {
    const response = await api.post("/ai/chat", { message, productId });
    return response.data;
  },
};

export default api;
