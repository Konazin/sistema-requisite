<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import PartnerForm from "@/components/partners/PartnerForm.vue";
import ErrorState from "@/components/ui/ErrorState.vue";
import { partnersService, type PartnerPayload } from "@/services/partners.service";

const router = useRouter();
const loading = ref(false);
const error = ref("");

async function createPartner(payload: PartnerPayload) {
  loading.value = true;
  error.value = "";
  try {
    const { partner } = await partnersService.create(payload);
    router.push(`/partners/${partner.id}`);
  } catch {
    error.value = "Não foi possível cadastrar o parceiro. Verifique os dados e tente novamente.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-extrabold text-brand-text">Novo parceiro</h1>
      <p class="mt-1 text-sm text-brand-secondary">Cadastre dados pessoais, contato, endereço e dados bancários com cuidado operacional.</p>
    </div>
    <ErrorState v-if="error" :message="error" />
    <PartnerForm submit-label="Cadastrar parceiro" :loading="loading" @submit="createPartner" @cancel="$router.push('/partners')" />
  </div>
</template>
