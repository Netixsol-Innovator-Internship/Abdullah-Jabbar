// frontend/lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======================
// AUTH ENDPOINTS
// ======================
export const register = async (data: {
  username: string;
  email: string;
  password: string;
  bio?: string;
}) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// ======================
// COMMENT ENDPOINTS
// ======================
export const createComment = async (postId: string, text: string) => {
  const res = await API.post("/comments/create", { postId, text });
  return res.data;
};

export const replyToComment = async (
  postId: string,
  parentCommentId: string,
  text: string
) => {
  const res = await API.post("/comments/reply", {
    postId,
    parentCommentId,
    text,
  });
  return res.data;
};

export const getCommentsForPost = async (postId: string, page = 0) => {
  const res = await API.get(`/comments/post/${postId}?page=${page}`);
  return res.data;
};

export const getReplies = async (parentId: string, page = 0) => {
  const res = await API.get(`/comments/replies/${parentId}?page=${page}`);
  return res.data;
};

export const getCommentById = async (id: string) => {
  const res = await API.get(`/comments/${id}`);
  return res.data;
};

// ======================
// FOLLOWERS ENDPOINTS
// ======================
export const toggleFollow = async (targetId: string) => {
  const res = await API.post(`/followers/toggle/${targetId}`);
  return res.data;
};

export const getFollowers = async (userId: string, page = 0) => {
  const res = await API.get(`/followers/followers/${userId}?page=${page}`);
  return res.data;
};

export const getFollowing = async (userId: string, page = 0) => {
  const res = await API.get(`/followers/following/${userId}?page=${page}`);
  return res.data;
};

export const checkIsFollowing = async (targetId: string) => {
  const res = await API.get(`/followers/is-following/${targetId}`);
  return res.data;
};

// ======================
// LIKES ENDPOINTS
// ======================
export const toggleLike = async (commentId: string) => {
  const res = await API.post(`/likes/toggle/${commentId}`);
  return res.data;
};

export const checkIsLiked = async (commentId: string) => {
  const res = await API.get(`/likes/is-liked/${commentId}`);
  return res.data;
};

// ======================
// NOTIFICATIONS ENDPOINTS
// ======================
export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id: string) => {
  const res = await API.post(`/notifications/mark-read/${id}`);
  return res.data;
};

// ======================
// USER ENDPOINTS
// ======================
export const getMe = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await API.get(`/users/by-id/${id}`);
  return res.data;
};

export const getUserByUsername = async (username: string) => {
  const res = await API.get(`/users/by-username/${username}`);
  return res.data;
};

export const updateMe = async (data: any) => {
  const res = await API.put("/users/me", data);
  return res.data;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/users/me/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export default API;
