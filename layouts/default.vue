<script setup>
import { ref } from "vue";
const { $notification } = useNuxtApp();
import AppLayout from "@/layouts/AppLayout.vue";
import { useToast } from "primevue/usetoast";
import { useLoading } from "vue-loading-overlay";

const toast = useToast();

const $loading = useLoading({
  // options
});

const submit = () => {
  const loader = $loading.show({
    // Optional parameters
  });
  // simulate AJAX
  setTimeout(() => {
    loader.hide();
  }, 5000);
};

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
  <app-layout></app-layout>
  <Toast />
  <Button @click="submit"/>
</template>
