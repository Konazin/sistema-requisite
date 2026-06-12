import { useAuthStore } from "@/stores/auth.store";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";
export class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}
export async function apiFetch(path, options = {}) {
    const auth = useAuthStore();
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    if (options.body !== undefined) {
        headers.set("Content-Type", "application/json");
    }
    if (auth.token) {
        headers.set("Authorization", `Bearer ${auth.token}`);
    }
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined
    });
    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : null;
    if (!response.ok) {
        throw new ApiError(payload?.message || payload?.error || "A API retornou um erro inesperado.", response.status);
    }
    return payload;
}
