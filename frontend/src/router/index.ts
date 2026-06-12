import { createRouter, createWebHistory } from "vue-router";
import AppShell from "@/components/layout/AppShell.vue";
import { useAuthStore } from "@/stores/auth.store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/login", name: "login", component: () => import("@/views/LoginView.vue"), meta: { public: true } },
    {
      path: "/",
      component: AppShell,
      children: [
        { path: "dashboard", name: "dashboard", component: () => import("@/views/DashboardView.vue") },
        { path: "partners", name: "partners", component: () => import("@/views/PartnersView.vue") },
        { path: "partners/new", name: "partner-create", component: () => import("@/views/PartnerCreateView.vue") },
        { path: "partners/import", name: "partner-import", component: () => import("@/views/PartnerImportView.vue") },
        { path: "partners/:id", name: "partner-details", component: () => import("@/views/PartnerDetailsView.vue") },
        { path: "partners/:id/edit", name: "partner-edit", component: () => import("@/views/PartnerEditView.vue") },
        { path: "users", name: "users", component: () => import("@/views/UsersView.vue") },
        { path: "settings", name: "settings", component: () => import("@/views/SettingsView.vue") }
      ]
    }
  ],
  scrollBehavior: () => ({ top: 0 })
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isAuthenticated) {
    return "/login";
  }
  if (to.path === "/login" && auth.isAuthenticated) {
    return "/dashboard";
  }
});

export default router;
