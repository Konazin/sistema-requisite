<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

defineEmits<{ menu: [] }>();

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-brand-border bg-white/95 backdrop-blur">
    <div class="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
      <div class="flex items-center gap-3">
        <button class="rounded-xl border border-brand-border px-3 py-2 text-brand-text lg:hidden" type="button" aria-label="Abrir menu" @click="$emit('menu')">
          ☰
        </button>
        <div>
          <p class="font-display text-base font-extrabold text-brand-text">Sistema Requisite</p>
          <p class="text-xs font-medium text-brand-secondary">Painel administrativo</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="hidden text-right sm:block">
          <p class="text-sm font-semibold text-brand-text">{{ auth.userName }}</p>
          <p class="text-xs text-brand-secondary">{{ auth.userEmail }}</p>
        </div>
        <button class="rounded-xl px-3 py-2 text-sm font-semibold text-brand-secondary hover:bg-brand-muted hover:text-brand-text" type="button" @click="logout">
          Sair
        </button>
      </div>
    </div>
  </header>
</template>
