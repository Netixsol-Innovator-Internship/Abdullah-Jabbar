export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  ingredients: string[];
  dosage: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  suggestedProducts?: Product[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AiSearchResult {
  intent: {
    categories: string[];
    ingredients: string[];
  };
  products: Product[];
  originalQuery: string;
}
