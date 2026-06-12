<script setup lang="ts">
defineProps<{ title: string; message: string }>();
</script>

<template>
  <div class="rounded-2xl border border-dashed border-brand-border bg-white p-8 text-center">
    <h3 class="font-display text-lg font-bold text-brand-text">{{ title }}</h3>
    <p class="mt-2 text-sm text-brand-secondary">{{ message }}</p>
    <div class="mt-5"><slot /></div>
  </div>
</template>
