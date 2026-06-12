<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import ErrorState from "@/components/ui/ErrorState.vue";
import LoadingState from "@/components/ui/LoadingState.vue";
import { formatDate, formatStatus } from "@/lib/formatters";
import { partnersService, type Partner } from "@/services/partners.service";

const partners = ref<Partner[]>([]);
const loading = ref(true);
const error = ref("");

const cards = computed(() => [
  { label: "Total de parceiros", value: partners.value.length },
  { label: "Parceiros ativos", value: partners.value.filter((p) => p.status === "ACTIVE").length },
  { label: "Cadastros incompletos", value: partners.value.filter((p) => p.status === "INCOMPLETE").length },
  { label: "Pendências de análise", value: partners.value.filter((p) => p.status === "PENDING_REVIEW").length }
]);

onMounted(async () => {
  try {
    partners.value = (await partnersService.list()).partners;
  } catch {
    error.value = "Os indicadores serão exibidos quando o endpoint de parceiros estiver disponível.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-extrabold text-brand-text">Dashboard</h1>
      <p class="mt-1 text-sm text-brand-secondary">Resumo operacional da base de parceiros.</p>
    </div>
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error" />
    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <BaseCard v-for="card in cards" :key="card.label">
          <p class="text-sm font-semibold text-brand-secondary">{{ card.label }}</p>
          <p class="mt-3 font-display text-3xl font-extrabold text-brand-text">{{ card.value }}</p>
        </BaseCard>
      </div>
      <div class="grid gap-5 lg:grid-cols-[1fr_320px]">
        <BaseCard>
          <h2 class="font-display text-lg font-bold">Atividades recentes</h2>
          <ul class="mt-4 divide-y divide-brand-border">
            <li v-for="partner in partners.slice(0, 5)" :key="partner.id" class="py-3 text-sm">
              <strong>{{ partner.fullName }}</strong> · {{ formatStatus(partner.status) }} · {{ formatDate(partner.createdAt) }}
            </li>
          </ul>
        </BaseCard>
        <BaseCard>
          <h2 class="font-display text-lg font-bold">Ações rápidas</h2>
          <div class="mt-4 grid gap-3">
            <BaseButton as="RouterLink" @click="$router.push('/partners/new')">Novo parceiro</BaseButton>
            <BaseButton variant="secondary" @click="$router.push('/partners/import')">Importar parceiros</BaseButton>
            <BaseButton variant="secondary" @click="$router.push('/partners?status=PENDING_REVIEW')">Ver pendências</BaseButton>
          </div>
        </BaseCard>
      </div>
    </template>
  </div>
</template>
