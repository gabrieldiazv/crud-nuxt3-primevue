<script setup>
import { useToast } from "primevue/usetoast";
const { $notification } = useNuxtApp();
const toast = useToast();

$notification.$on("toast", ({ severity, summary, detail }) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 3000,
  });
});
</script>

<template>
  <NuxtPage />
  <Toast />
</template>
