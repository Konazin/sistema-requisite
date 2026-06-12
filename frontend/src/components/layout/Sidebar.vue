<script setup lang="ts">
const items = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Parceiros", to: "/partners" },
  { label: "Importar parceiros", to: "/partners/import" },
  { label: "Usuários", to: "/users" },
  { label: "Configurações", to: "/settings" }
];
</script>

<template>
  <aside class="flex h-full w-72 flex-col bg-brand-ink text-white">
    <div class="border-b border-white/10 px-6 py-5">
      <p class="font-display text-xl font-extrabold">Sistema Requisite</p>
      <p class="mt-1 text-sm text-white/60">Gestão de parceiros</p>
    </div>
    <nav class="flex-1 space-y-1 px-3 py-5" aria-label="Navegação principal">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="block rounded-xl px-4 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/8 hover:text-white"
        active-class="!bg-brand-primary !text-brand-ink"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="border-t border-white/10 p-4 text-xs text-white/50">Requisite · ambiente interno</div>
  </aside>
</template>
