<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const auth = useAuthStore();
const email = ref("");
const password = ref("");
const error = ref("");

function submit() {
  error.value = "";
  try {
    auth.login(email.value, password.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Não foi possível entrar.";
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-brand-light px-4 py-10">
    <section class="w-full max-w-md rounded-2xl border border-brand-border bg-white p-6 shadow-soft">
      <div class="mb-6 text-center">
        <h1 class="font-display text-2xl font-extrabold text-brand-text">Sistema Requisite</h1>
        <p class="mt-2 text-sm text-brand-secondary">Acesso institucional para gestão de parceiros.</p>
      </div>
      <form class="space-y-4" @submit.prevent="submit">
        <BaseInput id="email" v-model="email" label="E-mail" type="email" required />
        <BaseInput id="password" v-model="password" label="Senha" type="password" required />
        <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm font-medium text-brand-error">{{ error }}</p>
        <BaseButton class="w-full" type="submit">Entrar</BaseButton>
      </form>
      <a class="mt-5 block text-center text-sm font-semibold text-brand-secondary hover:text-brand-dark" href="#">Recuperar senha</a>
    </section>
  </main>
</template>
