<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import ErrorState from "@/components/ui/ErrorState.vue";
import LoadingState from "@/components/ui/LoadingState.vue";
import { organizationsService, type Organization } from "@/services/organizations.service";

const organizations = ref<Organization[]>([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    organizations.value = (await organizationsService.list()).organizations;
  } catch {
    error.value = "Não foi possível carregar organizações.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-extrabold text-brand-text">Configurações</h1>
      <p class="mt-1 text-sm text-brand-secondary">Dados básicos e preferências do sistema.</p>
    </div>
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <div v-else class="grid gap-5 lg:grid-cols-2">
      <BaseCard>
        <h2 class="font-display text-lg font-bold">Organização</h2>
        <div class="mt-4 space-y-3 text-sm">
          <p><strong>Nome:</strong> {{ organizations[0]?.name || "Requisite" }}</p>
          <p><strong>Slug:</strong> {{ organizations[0]?.slug || "requisite" }}</p>
        </div>
      </BaseCard>
      <BaseCard>
        <h2 class="font-display text-lg font-bold">Preferências do sistema</h2>
        <div class="mt-4 space-y-3 text-sm text-brand-secondary">
          <label class="flex items-center gap-3"><input type="checkbox" checked /> Avisar sobre cadastros incompletos</label>
          <label class="flex items-center gap-3"><input type="checkbox" checked /> Exigir revisão para dados bancários alterados</label>
        </div>
      </BaseCard>
      <BaseCard class="lg:col-span-2">
        <h2 class="font-display text-lg font-bold">Integrações futuras</h2>
        <p class="mt-4 text-sm text-brand-secondary">Área reservada para conciliações, importações automáticas e provedores externos.</p>
      </BaseCard>
    </div>
  </div>
</template>
