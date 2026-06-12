<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: string;
  options: Array<{ label: string; value: string }>;
  error?: string;
  required?: boolean;
}>();

defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <label class="grid gap-1.5" :for="id">
    <span class="text-sm font-semibold text-brand-text">{{ label }} <span v-if="required" class="text-brand-error">*</span></span>
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      class="w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-brand-text"
      :class="error ? 'border-brand-error' : 'border-brand-border focus:border-brand-primary'"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Selecione</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <span v-if="error" class="text-xs font-medium text-brand-error">{{ error }}</span>
  </label>
</template>
