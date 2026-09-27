const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    // Only send Content-Type with a body: on GETs it would force a CORS preflight.
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json", ...init.headers } : init?.headers,
    });
  } catch {
    throw new ApiError("Can't reach the HRMS API. Check that it's running on " + API_URL + ".", 0);
  }

  if (!res.ok) {
    // NestJS errors look like { statusCode, message } where message may be a list.
    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(" ") : body?.message ?? body?.error;
    throw new ApiError(message ?? `Request failed with status ${res.status}.`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};

export function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong. Try again.";
}
