<script setup lang="ts">
defineProps<{ message?: string }>();
</script>

<template>
  <div class="grid min-h-48 place-items-center rounded-2xl border border-brand-border bg-white p-8 text-brand-secondary">
    <div class="flex items-center gap-3">
      <span class="h-5 w-5 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      <span class="text-sm font-medium">{{ message || "Carregando informações..." }}</span>
    </div>
  </div>
</template>
