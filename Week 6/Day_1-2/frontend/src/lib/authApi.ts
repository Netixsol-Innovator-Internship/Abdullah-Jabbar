// authApi.ts
// Small helper around fetch for auth endpoints.
// Configure backend base URL via NEXT_PUBLIC_API_BASE_URL (defaults to deployed backend)

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://abdullah-week6-backend.vercel.app";

export interface AuthSuccess {
  access_token: string;
}
export interface AuthError {
  error: string;
  status?: number;
}
export type AuthResponse = AuthSuccess | AuthError;

async function request<T>(
  path: string,
  options: RequestInit & { json?: Record<string, unknown> } = {}
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 15000); // 15s safety timeout
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    method: options.method || "POST",
    headers,
    body: options.json ? JSON.stringify(options.json) : options.body,
    signal: controller.signal,
    credentials: "include",
  });
  clearTimeout(id);

  let data: unknown = null;
  try {
    // parse only if response has JSON content-type
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json();
    }
  } catch {
    /* ignore parse errors */
  }

  if (!res.ok) {
    const parsed = data as Record<string, unknown> | null;
    const msg =
      (parsed && (parsed.error as string)) ||
      (parsed && (parsed.message as string)) ||
      res.statusText ||
      "Request failed";
    type ErrorWithData = Error & {
      status?: number;
      data?: Record<string, unknown> | null;
    };
    const err: ErrorWithData = new Error(msg);
    err.status = res.status;
    err.data = parsed;
    throw err;
  }
  return data as T;
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", { json: { email, password } });
}

// Registration now returns success + message (no token yet)
export interface PreRegisterSuccess {
  success: true;
  message: string;
}
export type PreRegisterResponse = PreRegisterSuccess | AuthError;
export function preRegister(email: string) {
  return request<PreRegisterResponse>("/auth/pre-register", {
    json: { email },
  });
}

// Final register includes otp now
export type RegisterSuccessAuth = AuthSuccess;
export type RegisterResponse = RegisterSuccessAuth | AuthError;
export function register(
  email: string,
  password: string,
  otp: string,
  name?: string
) {
  return request<RegisterResponse>("/auth/register", {
    json: { email, password, otp, name },
  });
}

// verifyEmail kept for backward compatibility (may be unused now)
export function verifyEmail(email: string, otp: string) {
  return request<AuthResponse>("/auth/verify-email", { json: { email, otp } });
}

export function resendOtp(email: string) {
  return request<{ success: boolean; message: string } | AuthError>(
    "/otp/request",
    { json: { email } }
  );
}

export interface ProfileResponse {
  _id?: string;
  email?: string;
  name?: string;
  roles?: string[];
  [k: string]: unknown;
}

export function me(token: string) {
  return request<ProfileResponse>("/auth/me", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export { BASE_URL };
