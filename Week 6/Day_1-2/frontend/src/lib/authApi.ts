// authApi.ts
// Small helper around fetch for auth endpoints.
// Configure backend base URL via NEXT_PUBLIC_API_BASE_URL (defaults to http://localhost:3000)

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

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
  options: RequestInit & { json?: any } = {}
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
    credentials: "include", // allows cookie-based auth if added later
  });
  clearTimeout(id);

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* ignore parse errors */
  }

  if (!res.ok) {
    const msg =
      data?.error || data?.message || res.statusText || "Request failed";
    throw Object.assign(new Error(msg), { status: res.status, data });
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
export interface RegisterSuccessAuth extends AuthSuccess {}
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
