<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

const file = ref<File | null>(null);
const preview = ref<string[]>([]);

function selectFile(event: Event) {
  const input = event.target as HTMLInputElement;
  file.value = input.files?.[0] || null;
  preview.value = file.value ? ["Nome completo", "E-mail", "CPF", "WhatsApp", "Cidade", "Estado", "Status"] : [];
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-extrabold text-brand-text">Importar parceiros</h1>
      <p class="mt-1 text-sm text-brand-secondary">Prepare arquivos CSV ou XLSX com os campos esperados antes da importação.</p>
    </div>
    <BaseCard>
      <div class="rounded-2xl border border-dashed border-brand-border bg-brand-muted/50 p-8 text-center">
        <p class="font-display text-lg font-bold text-brand-text">Upload de CSV ou XLSX</p>
        <p class="mt-2 text-sm text-brand-secondary">Campos esperados: nome completo, e-mail, CPF, RG, nascimento, WhatsApp, endereço, dados bancários, status e observações.</p>
        <label class="mt-5 inline-flex cursor-pointer rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-hover">
          Selecionar arquivo
          <input class="sr-only" type="file" accept=".csv,.xlsx" @change="selectFile" />
        </label>
        <p v-if="file" class="mt-3 text-sm font-semibold text-brand-text">{{ file.name }}</p>
      </div>
      <div class="mt-5 flex justify-end">
        <BaseButton :disabled="!file">Importar</BaseButton>
      </div>
    </BaseCard>
    <BaseCard v-if="preview.length">
      <h2 class="font-display text-lg font-bold">Preview da importação</h2>
      <div class="mt-4 flex flex-wrap gap-2">
        <span v-for="field in preview" :key="field" class="rounded-full bg-brand-muted px-3 py-1 text-sm font-semibold text-brand-secondary">{{ field }}</span>
      </div>
      <p class="mt-4 text-sm text-brand-secondary">TODO: conectar ao endpoint real de importação quando disponível.</p>
    </BaseCard>
    <EmptyState v-else title="Nenhum arquivo selecionado" message="Selecione um arquivo para visualizar a preparação da importação." />
  </div>
</template>
