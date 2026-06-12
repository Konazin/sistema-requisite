<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import ErrorState from "@/components/ui/ErrorState.vue";
import LoadingState from "@/components/ui/LoadingState.vue";
import { formatCep, formatCpf, formatDate, formatStatus, formatWhatsapp, statusTone } from "@/lib/formatters";
import { partnersService, type Partner } from "@/services/partners.service";

const route = useRoute();
const router = useRouter();
const partner = ref<Partner | null>(null);
const loading = ref(true);
const error = ref("");

function row(label: string, value?: string | null) {
  return { label, value: value || "Não informado" };
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    partner.value = (await partnersService.get(String(route.params.id))).partner;
  } catch {
    error.value = "Não foi possível carregar o parceiro.";
  } finally {
    loading.value = false;
  }
}

async function archivePartner() {
  if (!partner.value) return;
  try {
    await partnersService.archive(partner.value.id);
    router.push("/partners");
  } catch {
    error.value = "Não foi possível arquivar este parceiro agora.";
  }
}

onMounted(load);
</script>

<template>
  <div class="space-y-6">
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error && !partner" :message="error">
      <BaseButton variant="secondary" @click="$router.push('/partners')">Voltar à listagem</BaseButton>
    </ErrorState>
    <template v-else-if="partner">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="font-display text-2xl font-extrabold text-brand-text">{{ partner.fullName }}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <BaseBadge :tone="statusTone(partner.status)">{{ formatStatus(partner.status) }}</BaseBadge>
            <span class="text-sm text-brand-secondary">Criado em {{ formatDate(partner.createdAt) }}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <BaseButton variant="secondary" @click="$router.push('/partners')">Voltar</BaseButton>
          <BaseButton @click="$router.push(`/partners/${partner.id}/edit`)">Editar parceiro</BaseButton>
          <BaseButton variant="danger" @click="archivePartner">Arquivar</BaseButton>
        </div>
      </div>
      <p class="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-800">
        Dados pessoais protegidos. Acesse e compartilhe apenas quando necessário.
      </p>
      <ErrorState v-if="error" :message="error" />
      <div class="grid gap-5 lg:grid-cols-2">
        <BaseCard>
          <h2 class="font-display text-lg font-bold">Dados pessoais</h2>
          <dl class="mt-4 grid gap-3 text-sm">
            <div v-for="item in [row('CPF', formatCpf(partner.cpf)), row('RG/Identidade', partner.rg), row('Nascimento', formatDate(partner.birthDate))]" :key="item.label">
              <dt class="font-semibold text-brand-secondary">{{ item.label }}</dt>
              <dd class="mt-1 text-brand-text">{{ item.value }}</dd>
            </div>
          </dl>
        </BaseCard>
        <BaseCard>
          <h2 class="font-display text-lg font-bold">Contato</h2>
          <dl class="mt-4 grid gap-3 text-sm">
            <div v-for="item in [row('E-mail', partner.email), row('WhatsApp', formatWhatsapp(partner.whatsapp))]" :key="item.label">
              <dt class="font-semibold text-brand-secondary">{{ item.label }}</dt>
              <dd class="mt-1 text-brand-text">{{ item.value }}</dd>
            </div>
          </dl>
        </BaseCard>
        <BaseCard>
          <h2 class="font-display text-lg font-bold">Endereço</h2>
          <dl class="mt-4 grid gap-3 text-sm">
            <div v-for="item in [
              row('CEP', formatCep(partner.address?.zipCode)),
              row('Rua', partner.address?.street),
              row('Número', partner.address?.number),
              row('Complemento', partner.address?.complement),
              row('Bairro', partner.address?.district),
              row('Cidade/UF', `${partner.address?.city || '-'} / ${partner.address?.state || '-'}`),
              row('País', partner.address?.country)
            ]" :key="item.label">
              <dt class="font-semibold text-brand-secondary">{{ item.label }}</dt>
              <dd class="mt-1 text-brand-text">{{ item.value }}</dd>
            </div>
          </dl>
        </BaseCard>
        <BaseCard>
          <h2 class="font-display text-lg font-bold">Dados bancários</h2>
          <dl class="mt-4 grid gap-3 text-sm">
            <div v-for="item in [
              row('Banco', partner.bankAccount?.bankName),
              row('Código', partner.bankAccount?.bankCode),
              row('Agência', partner.bankAccount?.agency),
              row('Conta', `${partner.bankAccount?.accountNumber || '-'}-${partner.bankAccount?.accountDigit || '-'}`),
              row('Tipo de conta', partner.bankAccount?.accountType),
              row('Titular', partner.bankAccount?.holderName),
              row('CPF do titular', formatCpf(partner.bankAccount?.holderCpf)),
              row('Chave Pix', partner.bankAccount?.pixKey),
              row('Tipo da chave Pix', partner.bankAccount?.pixKeyType)
            ]" :key="item.label">
              <dt class="font-semibold text-brand-secondary">{{ item.label }}</dt>
              <dd class="mt-1 break-words text-brand-text">{{ item.value }}</dd>
            </div>
          </dl>
        </BaseCard>
        <BaseCard>
          <h2 class="font-display text-lg font-bold">Observações internas</h2>
          <p class="mt-4 whitespace-pre-wrap text-sm text-brand-text">{{ partner.notes || "Nenhuma observação registrada." }}</p>
        </BaseCard>
        <BaseCard>
          <h2 class="font-display text-lg font-bold">Histórico</h2>
          <p class="mt-4 text-sm text-brand-secondary">Histórico de alterações será exibido quando o endpoint de auditoria estiver disponível.</p>
        </BaseCard>
      </div>
    </template>
  </div>
</template>
