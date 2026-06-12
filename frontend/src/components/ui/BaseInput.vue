<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}>();

defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <label class="grid gap-1.5" :for="id">
    <span class="text-sm font-semibold text-brand-text">{{ label }} <span v-if="required" class="text-brand-error">*</span></span>
    <input
      :id="id"
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      class="w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-secondary/70"
      :class="error ? 'border-brand-error' : 'border-brand-border focus:border-brand-primary'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="text-xs font-medium text-brand-error">{{ error }}</span>
  </label>
</template>
