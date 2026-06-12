import { apiFetch } from "@/lib/api";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export const organizationsService = {
  list() {
    return apiFetch<{ organizations: Organization[] }>("/api/organizations");
  },
  create(payload: { name: string; slug: string }) {
    return apiFetch<{ organization: Organization }>("/api/organizations", { method: "POST", body: payload });
  }
};
