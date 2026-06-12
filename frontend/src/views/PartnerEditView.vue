<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PartnerForm from "@/components/partners/PartnerForm.vue";
import ErrorState from "@/components/ui/ErrorState.vue";
import LoadingState from "@/components/ui/LoadingState.vue";
import { partnersService, type Partner, type PartnerPayload } from "@/services/partners.service";

const route = useRoute();
const partner = ref<Partner | null>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const success = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    partner.value = (await partnersService.get(String(route.params.id))).partner;
  } catch {
    error.value = "Não foi possível carregar os dados do parceiro.";
  } finally {
    loading.value = false;
  }
}

async function save(payload: PartnerPayload) {
  saving.value = true;
  error.value = "";
  success.value = "";
  try {
    partner.value = (await partnersService.update(String(route.params.id), payload)).partner;
    success.value = "Alterações salvas com sucesso.";
  } catch {
    error.value = "Não foi possível salvar as alterações.";
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-extrabold text-brand-text">Editar parceiro</h1>
      <p class="mt-1 text-sm text-brand-secondary">Revise dados sensíveis antes de salvar alterações.</p>
    </div>
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error && !partner" :message="error" />
    <template v-else-if="partner">
      <p v-if="success" class="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-brand-success">{{ success }}</p>
      <ErrorState v-if="error" :message="error" />
      <PartnerForm :initial="partner" submit-label="Salvar alterações" :loading="saving" @submit="save" @cancel="$router.push(`/partners/${partner.id}`)" />
    </template>
  </div>
</template>
