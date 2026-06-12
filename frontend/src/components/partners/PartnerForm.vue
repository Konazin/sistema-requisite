<script setup lang="ts">
import { reactive, watch } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseTextarea from "@/components/ui/BaseTextarea.vue";
import { formatCep, formatCpf, formatWhatsapp } from "@/lib/formatters";
import { isValidCpfFormat, isValidEmail, normalizeCpf, normalizePhone } from "@/lib/validators";
import type { Partner, PartnerPayload } from "@/services/partners.service";

const props = defineProps<{ initial?: Partner | null; loading?: boolean; submitLabel: string }>();
const emit = defineEmits<{ submit: [payload: PartnerPayload]; cancel: [] }>();

type FormState = {
  fullName: string;
  cpf: string;
  rg: string;
  birthDate: string;
  email: string;
  whatsapp: string;
  status: string;
  notes: string;
  address: Record<string, string>;
  bankAccount: Record<string, string>;
};

const form = reactive<FormState>({
  fullName: "",
  cpf: "",
  rg: "",
  birthDate: "",
  email: "",
  whatsapp: "",
  status: "ACTIVE",
  notes: "",
  address: { zipCode: "", street: "", number: "", complement: "", district: "", city: "", state: "", country: "Brasil" },
  bankAccount: { bankName: "", bankCode: "", agency: "", accountNumber: "", accountDigit: "", accountType: "", holderName: "", holderCpf: "", pixKey: "", pixKeyType: "" }
});

const errors = reactive<Record<string, string>>({});

const statusOptions = [
  { label: "Ativo", value: "ACTIVE" },
  { label: "Pendente de análise", value: "PENDING_REVIEW" },
  { label: "Incompleto", value: "INCOMPLETE" },
  { label: "Bloqueado", value: "BLOCKED" },
  { label: "Arquivado", value: "ARCHIVED" }
];

const accountTypes = [
  { label: "Corrente", value: "CHECKING" },
  { label: "Poupança", value: "SAVINGS" },
  { label: "Pagamento", value: "PAYMENT" }
];

const pixTypes = [
  { label: "CPF", value: "CPF" },
  { label: "E-mail", value: "EMAIL" },
  { label: "Telefone", value: "PHONE" },
  { label: "Chave aleatória", value: "RANDOM" },
  { label: "CNPJ", value: "CNPJ" }
];

watch(
  () => props.initial,
  (partner) => {
    if (!partner) return;
    form.fullName = partner.fullName || "";
    form.cpf = formatCpf(partner.cpf);
    form.rg = partner.rg || "";
    form.birthDate = partner.birthDate ? partner.birthDate.slice(0, 10) : "";
    form.email = partner.email || "";
    form.whatsapp = formatWhatsapp(partner.whatsapp);
    form.status = partner.status || "ACTIVE";
    form.notes = partner.notes || "";
    Object.assign(form.address, partner.address || {});
    Object.assign(form.bankAccount, partner.bankAccount || {});
    form.address.zipCode = formatCep(form.address.zipCode);
    form.bankAccount.holderCpf = formatCpf(form.bankAccount.holderCpf);
  },
  { immediate: true }
);

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (!form.fullName.trim()) errors.fullName = "Nome completo é obrigatório.";
  if (!form.cpf.trim()) errors.cpf = "CPF é obrigatório.";
  if (form.cpf && !isValidCpfFormat(form.cpf)) errors.cpf = "Use o formato 000.000.000-00.";
  if (form.email && !isValidEmail(form.email)) errors.email = "Informe um e-mail válido.";
  return Object.keys(errors).length === 0;
}

function submit() {
  if (!validate()) return;
  emit("submit", {
    fullName: form.fullName.trim(),
    cpf: normalizeCpf(form.cpf),
    rg: form.rg.trim() || null,
    birthDate: form.birthDate || null,
    email: form.email.trim() || null,
    whatsapp: normalizePhone(form.whatsapp) || null,
    status: form.status as PartnerPayload["status"],
    notes: form.notes.trim() || null,
    address: { ...form.address, zipCode: formatCep(form.address.zipCode) },
    bankAccount: { ...form.bankAccount, holderCpf: normalizeCpf(form.bankAccount.holderCpf) || null }
  });
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <BaseCard>
      <h2 class="font-display text-lg font-bold text-brand-text">Dados pessoais</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <BaseInput id="fullName" v-model="form.fullName" label="Nome completo" required :error="errors.fullName" />
        <BaseInput id="cpf" v-model="form.cpf" label="CPF" required :error="errors.cpf" @update:model-value="form.cpf = formatCpf($event)" />
        <BaseInput id="rg" v-model="form.rg" label="RG/Identidade" />
        <BaseInput id="birthDate" v-model="form.birthDate" label="Data de nascimento" type="date" />
        <BaseSelect id="status" v-model="form.status" label="Status" :options="statusOptions" />
      </div>
    </BaseCard>

    <BaseCard>
      <h2 class="font-display text-lg font-bold text-brand-text">Contato</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <BaseInput id="email" v-model="form.email" label="E-mail" type="email" :error="errors.email" />
        <BaseInput id="whatsapp" v-model="form.whatsapp" label="WhatsApp" @update:model-value="form.whatsapp = formatWhatsapp($event)" />
      </div>
    </BaseCard>

    <BaseCard>
      <h2 class="font-display text-lg font-bold text-brand-text">Endereço</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-3">
        <BaseInput id="zipCode" v-model="form.address.zipCode" label="CEP" @update:model-value="form.address.zipCode = formatCep($event)" />
        <BaseInput id="street" v-model="form.address.street" label="Rua" />
        <BaseInput id="number" v-model="form.address.number" label="Número" />
        <BaseInput id="complement" v-model="form.address.complement" label="Complemento" />
        <BaseInput id="district" v-model="form.address.district" label="Bairro" />
        <BaseInput id="city" v-model="form.address.city" label="Cidade" />
        <BaseInput id="state" v-model="form.address.state" label="Estado" />
        <BaseInput id="country" v-model="form.address.country" label="País" />
      </div>
    </BaseCard>

    <BaseCard>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="font-display text-lg font-bold text-brand-text">Dados bancários</h2>
        <span class="text-xs font-semibold text-brand-secondary">Visíveis apenas em detalhes e edição</span>
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-3">
        <BaseInput id="bankName" v-model="form.bankAccount.bankName" label="Banco" />
        <BaseInput id="bankCode" v-model="form.bankAccount.bankCode" label="Código do banco" />
        <BaseInput id="agency" v-model="form.bankAccount.agency" label="Agência" />
        <BaseInput id="accountNumber" v-model="form.bankAccount.accountNumber" label="Conta" />
        <BaseInput id="accountDigit" v-model="form.bankAccount.accountDigit" label="Dígito" />
        <BaseSelect id="accountType" v-model="form.bankAccount.accountType" label="Tipo de conta" :options="accountTypes" />
        <BaseInput id="holderName" v-model="form.bankAccount.holderName" label="Nome do titular" />
        <BaseInput id="holderCpf" v-model="form.bankAccount.holderCpf" label="CPF do titular" @update:model-value="form.bankAccount.holderCpf = formatCpf($event)" />
        <BaseInput id="pixKey" v-model="form.bankAccount.pixKey" label="Chave Pix" />
        <BaseSelect id="pixKeyType" v-model="form.bankAccount.pixKeyType" label="Tipo da chave Pix" :options="pixTypes" />
      </div>
    </BaseCard>

    <BaseCard>
      <BaseTextarea id="notes" v-model="form.notes" label="Observações internas" placeholder="Registre informações internas relevantes." />
    </BaseCard>

    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <BaseButton variant="secondary" type="button" @click="$emit('cancel')">Cancelar</BaseButton>
      <BaseButton type="submit" :loading="loading">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
