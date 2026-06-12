<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";

const mobileOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-brand-light">
    <div class="fixed inset-y-0 left-0 hidden lg:block">
      <Sidebar />
    </div>

    <div v-if="mobileOpen" class="fixed inset-0 z-40 lg:hidden">
      <button class="absolute inset-0 bg-brand-ink/55" type="button" aria-label="Fechar menu" @click="mobileOpen = false" />
      <div class="relative h-full w-72">
        <Sidebar />
      </div>
    </div>

    <div class="lg:pl-72">
      <Topbar @menu="mobileOpen = true" />
      <main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
