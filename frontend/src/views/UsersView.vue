<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseBadge from "@/components/ui/BaseBadge.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import ErrorState from "@/components/ui/ErrorState.vue";
import LoadingState from "@/components/ui/LoadingState.vue";
import { formatDate } from "@/lib/formatters";
import { usersService, type User } from "@/services/users.service";

const users = ref<User[]>([]);
const loading = ref(true);
const error = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    users.value = (await usersService.list()).users;
  } catch {
    error.value = "Não foi possível carregar usuários.";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-extrabold text-brand-text">Usuários</h1>
        <p class="mt-1 text-sm text-brand-secondary">Controle de acessos internos.</p>
      </div>
      <BaseButton>Novo usuário</BaseButton>
    </div>
    <LoadingState v-if="loading" />
    <ErrorState v-else-if="error" :message="error">
      <BaseButton variant="secondary" @click="load">Tentar novamente</BaseButton>
    </ErrorState>
    <EmptyState v-else-if="users.length === 0" title="Nenhum usuário cadastrado" message="Crie usuários para organizar o acesso ao sistema." />
    <BaseTable v-else>
      <thead class="bg-brand-muted text-xs uppercase tracking-wide text-brand-secondary">
        <tr>
          <th class="px-4 py-3">Nome</th>
          <th class="px-4 py-3">E-mail</th>
          <th class="px-4 py-3">Papel</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Criado em</th>
          <th class="px-4 py-3">Ações</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-brand-border">
        <tr v-for="user in users" :key="user.id" class="hover:bg-brand-muted/60">
          <td class="px-4 py-3 font-semibold">{{ user.name }}</td>
          <td class="px-4 py-3 text-brand-secondary">{{ user.email }}</td>
          <td class="px-4 py-3"><BaseBadge tone="brand">{{ user.role || "Membro" }}</BaseBadge></td>
          <td class="px-4 py-3"><BaseBadge tone="success">{{ user.status || "Ativo" }}</BaseBadge></td>
          <td class="px-4 py-3 text-brand-secondary">{{ formatDate(user.createdAt) }}</td>
          <td class="px-4 py-3"><BaseButton variant="ghost">Editar</BaseButton></td>
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>
