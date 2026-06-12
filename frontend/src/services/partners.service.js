import { apiFetch } from "@/lib/api";
export const partnersService = {
    list() {
        return apiFetch("/api/partners");
    },
    get(id) {
        return apiFetch(`/api/partners/${id}`);
    },
    create(payload) {
        return apiFetch("/api/partners", { method: "POST", body: payload });
    },
    update(id, payload) {
        return apiFetch(`/api/partners/${id}`, { method: "PATCH", body: payload });
    },
    archive(id) {
        return apiFetch(`/api/partners/${id}`, { method: "DELETE" });
    }
};
