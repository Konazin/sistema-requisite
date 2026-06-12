<script setup lang="ts">
withDefaults(defineProps<{ tone?: "success" | "warning" | "danger" | "neutral" | "brand" }>(), { tone: "neutral" });
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
    :class="{
      'bg-emerald-50 text-brand-success': tone === 'success',
      'bg-amber-50 text-brand-warning': tone === 'warning',
      'bg-red-50 text-brand-error': tone === 'danger',
      'bg-brand-muted text-brand-secondary': tone === 'neutral',
      'bg-brand-primary/15 text-brand-dark': tone === 'brand'
    }"
  >
    <slot />
  </span>
</template>
