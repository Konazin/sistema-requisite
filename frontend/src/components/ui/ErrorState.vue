<script setup lang="ts">
defineProps<{ title?: string; message: string }>();
</script>

<template>
  <div class="rounded-2xl border border-red-100 bg-red-50 p-5 text-brand-error">
    <h3 class="font-display text-base font-bold">{{ title || "Não foi possível carregar" }}</h3>
    <p class="mt-1 text-sm">{{ message }}</p>
    <div class="mt-4"><slot /></div>
  </div>
</template>
