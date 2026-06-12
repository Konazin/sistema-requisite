<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "danger" | "ghost";
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    disabled?: boolean;
  }>(),
  { variant: "primary", type: "button", loading: false, disabled: false }
);
</script>

<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'bg-brand-primary text-brand-ink hover:bg-brand-hover': variant === 'primary',
      'border border-brand-border bg-white text-brand-text hover:bg-brand-muted': variant === 'secondary',
      'bg-brand-error text-white hover:bg-red-700': variant === 'danger',
      'text-brand-secondary hover:bg-brand-muted hover:text-brand-text': variant === 'ghost'
    }"
  >
    <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <slot />
  </button>
</template>
