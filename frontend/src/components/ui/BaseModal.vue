<script setup lang="ts">
defineProps<{ open: boolean; title: string }>();
defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-brand-ink/50 p-4" role="dialog" aria-modal="true">
      <section class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-soft">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h2 class="font-display text-lg font-bold text-brand-text">{{ title }}</h2>
          <button class="rounded-lg px-2 py-1 text-brand-secondary hover:bg-brand-muted" type="button" aria-label="Fechar" @click="$emit('close')">×</button>
        </div>
        <slot />
      </section>
    </div>
  </Teleport>
</template>
