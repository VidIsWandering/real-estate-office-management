/**
 * API Client Configuration
 * Centralized fetch wrapper for backend communication
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

/**
 * Generic API request handler with error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Default to JSON for non-FormData bodies.
  // For multipart/form-data, the browser must set the boundary automatically.
  if (!headers["Content-Type"] && !isFormData(fetchOptions.body)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Normalize URL: remove trailing slash from base, leading slash from endpoint
  const normalizedBase = API_BASE_URL.replace(/\/$/, "");
  const normalizedEndpoint = endpoint.replace(/^\//, "");
  const url = `${normalizedBase}/${normalizedEndpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Parse response body
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        data?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0,
    );
  }
}

/**
 * GET request
 */
export async function get<T>(endpoint: string, token?: string): Promise<T> {
  return request<T>(endpoint, { method: "GET", token });
}

/**
 * POST request
 */
export async function post<T>(
  endpoint: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

/**
 * POST multipart/form-data
 */
export async function postFormData<T>(
  endpoint: string,
  body: FormData,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body,
    token,
  });
}

/**
 * PUT multipart/form-data
 */
export async function putFormData<T>(
  endpoint: string,
  body: FormData,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "PUT",
    body,
    token,
  });
}

/**
 * PUT request
 */
export async function put<T>(
  endpoint: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
}

/**
 * PATCH request
 */
export async function patch<T>(
  endpoint: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string, token?: string): Promise<T> {
  return request<T>(endpoint, { method: "DELETE", token });
}

/**
 * Helper to get auth token from localStorage (client-side only)
 */
export function getAuthToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("auth_token") || undefined;
}
