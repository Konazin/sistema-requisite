import { apiFetch } from "@/lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  createdAt: string;
};

export const usersService = {
  list() {
    return apiFetch<{ users: User[] }>("/api/users");
  },
  create(payload: { name: string; email: string }) {
    return apiFetch<{ user: User }>("/api/users", { method: "POST", body: payload });
  }
};
