import { apiFetch } from "@/lib/api";
export const organizationsService = {
    list() {
        return apiFetch("/api/organizations");
    },
    create(payload) {
        return apiFetch("/api/organizations", { method: "POST", body: payload });
    }
};
