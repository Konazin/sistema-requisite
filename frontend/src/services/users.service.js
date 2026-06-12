import { apiFetch } from "@/lib/api";
export const usersService = {
    list() {
        return apiFetch("/api/users");
    },
    create(payload) {
        return apiFetch("/api/users", { method: "POST", body: payload });
    }
};
