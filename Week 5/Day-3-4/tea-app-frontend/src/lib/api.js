// tea-app-frontend/src/lib/api.js
import axios from "axios";

// Reviews backend (deployed)
const REVIEWS_BASE = "https://week5-day3-4-tea-reviews-backend.vercel.app";

// Keep the axios instance pointed at the reviews backend for reviews/auth actions
const API = axios.create({
  baseURL: REVIEWS_BASE,
  withCredentials: true, // Send cookies with requests
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
export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// ======================
// REVIEW ENDPOINTS
// ======================
export const createReview = async (
  postId,
  text,
  authorId = "anonymous",
  authorName = "Anonymous User",
  rating = 5
) => {
  const res = await API.post("/reviews/create", {
    postId,
    text,
    authorId,
    authorName,
    rating,
  });
  return res.data;
};

export const replyToReview = async (
  postId,
  parentReviewId,
  text,
  authorId = "anonymous",
  authorName = "Anonymous User"
) => {
  const res = await API.post("/reviews/reply", {
    postId,
    parentReviewId,
    text,
    authorId,
    authorName,
  });
  return res.data;
};

export const getReviewsForPost = async (postId, page = 0) => {
  const res = await API.get(`/reviews/post/${postId}?page=${page}`);
  return res.data;
};

export const getReplies = async (parentId, page = 0) => {
  const res = await API.get(`/reviews/replies/${parentId}?page=${page}`);
  return res.data;
};

export const getReviewById = async (id) => {
  const res = await API.get(`/reviews/${id}`);
  return res.data;
};

// Legacy aliases for backward compatibility
export const createComment = createReview;
export const replyToComment = replyToReview;
export const getCommentsForPost = getReviewsForPost;
export const getCommentById = getReviewById;

// ======================
// FOLLOWERS ENDPOINTS
// ======================
export const toggleFollow = async (targetId) => {
  const res = await API.post(`/followers/toggle/${targetId}`);
  return res.data;
};

export const getFollowers = async (userId, page = 0) => {
  const res = await API.get(`/followers/followers/${userId}?page=${page}`);
  return res.data;
};

export const getFollowing = async (userId, page = 0) => {
  const res = await API.get(`/followers/following/${userId}?page=${page}`);
  return res.data;
};

export const checkIsFollowing = async (targetId) => {
  const res = await API.get(`/followers/is-following/${targetId}`);
  return res.data;
};

// ======================
// LIKES ENDPOINTS
// ======================
// LIKES ENDPOINTS
// ======================
export const toggleLike = async (reviewId, userId = "anonymous") => {
  const res = await API.post(`/likes/toggle/${reviewId}`, { userId });
  return res.data;
};

export const checkIsLiked = async (reviewId, userId = "anonymous") => {
  const res = await API.get(`/likes/is-liked/${reviewId}`, {
    data: { userId },
  });
  return res.data;
};

// ======================
// NOTIFICATIONS ENDPOINTS
// ======================
export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id) => {
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

export const getUserById = async (id) => {
  const res = await API.get(`/users/by-id/${id}`);
  return res.data;
};

export const getUserByUsername = async (username) => {
  const res = await API.get(`/users/by-username/${username}`);
  return res.data;
};

export const updateMe = async (data) => {
  const res = await API.put("/users/me", data);
  return res.data;
};

export const uploadProfilePicture = async (file) => {
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
