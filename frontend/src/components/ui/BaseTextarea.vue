<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: string;
  placeholder?: string;
  rows?: number;
  error?: string;
}>();

defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <label class="grid gap-1.5" :for="id">
    <span class="text-sm font-semibold text-brand-text">{{ label }}</span>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows || 4"
      class="w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-secondary/70"
      :class="error ? 'border-brand-error' : 'border-brand-border focus:border-brand-primary'"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="error" class="text-xs font-medium text-brand-error">{{ error }}</span>
  </label>
</template>
