<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import ErrorState from "@/components/ui/ErrorState.vue";
import LoadingState from "@/components/ui/LoadingState.vue";
import { formatDate, formatStatus, formatWhatsapp, maskCpf, statusTone } from "@/lib/formatters";
import { partnersService, type Partner } from "@/services/partners.service";

const partners = ref<Partner[]>([]);
const loading = ref(true);
const error = ref("");
const search = ref("");
const status = ref("");
const city = ref("");
const state = ref("");
const createdAt = ref("");

const statuses = [
  { label: "Ativo", value: "ACTIVE" },
  { label: "Pendente de análise", value: "PENDING_REVIEW" },
  { label: "Incompleto", value: "INCOMPLETE" },
  { label: "Bloqueado", value: "BLOCKED" },
  { label: "Arquivado", value: "ARCHIVED" }
];

const filtered = computed(() => {
  const term = search.value.toLowerCase().replace(/\D/g, "");
  const rawTerm = search.value.toLowerCase();
  return partners.value.filter((partner) => {
    const cpf = partner.cpf.replace(/\D/g, "");
    const phone = partner.whatsapp?.replace(/\D/g, "") || "";
    const matchesSearch = !search.value || partner.fullName.toLowerCase().includes(rawTerm) || partner.email?.toLowerCase().includes(rawTerm) || cpf.includes(term) || phone.includes(term);
    const matchesStatus = !status.value || partner.status === status.value;
    const matchesCity = !city.value || partner.address?.city?.toLowerCase().includes(city.value.toLowerCase());
    const matchesState = !state.value || partner.address?.state?.toLowerCase().includes(state.value.toLowerCase());
    const matchesDate = !createdAt.value || partner.createdAt.slice(0, 10) === createdAt.value;
    return matchesSearch && matchesStatus && matchesCity && matchesState && matchesDate;
  });
});

async function load() {
  loading.value = true;
  error.value = "";
  try {
    partners.value = (await partnersService.list()).partners;
  } catch {
    error.value = "Não foi possível carregar parceiros. Verifique se o endpoint /api/partners está disponível.";
  } finally {
    loading.value = false;
  }
}

async function archivePartner(id: string) {
  try {
    await partnersService.archive(id);
    await load();
  } catch {
    error.value = "Não foi possível arquivar este parceiro agora.";
  }
}

onMounted(load);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-extrabold text-brand-text">Parceiros</h1>
        <p class="mt-1 text-sm text-brand-secondary">CPF sempre mascarado na listagem. RG e dados bancários não são exibidos aqui.</p>
      </div>
      <BaseButton @click="$router.push('/partners/new')">Novo parceiro</BaseButton>
    </div>
    <div class="grid gap-3 rounded-2xl border border-brand-border bg-white p-4 md:grid-cols-5">
      <BaseInput id="search" v-model="search" label="Busca" placeholder="Nome, e-mail, CPF ou WhatsApp" />
      <BaseSelect id="status" v-model="status" label="Status" :options="statuses" />
      <BaseInput id="city" v-model="city" label="Cidade" />
      <BaseInput id="state" v-model="state" label="Estado" />
      <BaseInput id="createdAt" v-model="createdAt" label="Data de cadastro" type="date" />
    </div>
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error">
      <BaseButton variant="secondary" @click="load">Tentar novamente</BaseButton>
    </ErrorState>
    <EmptyState v-else-if="filtered.length === 0" title="Nenhum parceiro encontrado" message="Ajuste os filtros ou cadastre um novo parceiro.">
      <BaseButton @click="$router.push('/partners/new')">Cadastrar parceiro</BaseButton>
    </EmptyState>
    <BaseTable v-else>
      <thead class="bg-brand-muted text-xs uppercase tracking-wide text-brand-secondary">
        <tr>
          <th class="px-4 py-3">Nome completo</th>
          <th class="px-4 py-3">E-mail</th>
          <th class="px-4 py-3">WhatsApp</th>
          <th class="px-4 py-3">CPF</th>
          <th class="px-4 py-3">Cidade/UF</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Criado em</th>
          <th class="px-4 py-3">Ações</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-brand-border">
        <tr v-for="partner in filtered" :key="partner.id" class="hover:bg-brand-muted/60">
          <td class="px-4 py-3 font-semibold text-brand-text">{{ partner.fullName }}</td>
          <td class="px-4 py-3 text-brand-secondary">{{ partner.email || "Não informado" }}</td>
          <td class="px-4 py-3 text-brand-secondary">{{ formatWhatsapp(partner.whatsapp) || "Não informado" }}</td>
          <td class="px-4 py-3 font-medium text-brand-secondary">{{ maskCpf(partner.cpf) }}</td>
          <td class="px-4 py-3 text-brand-secondary">{{ partner.address?.city || "-" }}/{{ partner.address?.state || "-" }}</td>
          <td class="px-4 py-3"><BaseBadge :tone="statusTone(partner.status)">{{ formatStatus(partner.status) }}</BaseBadge></td>
          <td class="px-4 py-3 text-brand-secondary">{{ formatDate(partner.createdAt) }}</td>
          <td class="px-4 py-3">
            <div class="flex gap-2">
              <BaseButton variant="ghost" @click="$router.push(`/partners/${partner.id}`)">Ver</BaseButton>
              <BaseButton variant="ghost" @click="$router.push(`/partners/${partner.id}/edit`)">Editar</BaseButton>
              <BaseButton variant="ghost" @click="archivePartner(partner.id)">Arquivar</BaseButton>
            </div>
          </td>
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>
