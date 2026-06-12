import { computed, ref } from "vue";
import { defineStore } from "pinia";

const TOKEN_KEY = "sistema-requisite-token";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem(TOKEN_KEY));
  const userName = ref(localStorage.getItem("sistema-requisite-user") || "Usuário Requisite");
  const userEmail = ref(localStorage.getItem("sistema-requisite-email") || "usuario@requisite.com.br");

  const isAuthenticated = computed(() => Boolean(token.value));

  function login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Informe e-mail e senha para continuar.");
    }
    token.value = "local-session";
    userEmail.value = email;
    userName.value = email.split("@")[0] || "Usuário Requisite";
    localStorage.setItem(TOKEN_KEY, token.value);
    localStorage.setItem("sistema-requisite-email", userEmail.value);
    localStorage.setItem("sistema-requisite-user", userName.value);
  }

  function logout() {
    token.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  return { token, userName, userEmail, isAuthenticated, login, logout };
});
