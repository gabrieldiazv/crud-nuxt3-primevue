<script setup>
import { ref } from "vue";
const { $notification, $loader } = useNuxtApp();
import AppLayout from "@/layouts/AppLayout.vue";
import { useToast } from "primevue/usetoast";
import { useLoading } from "vue-loading-overlay";

const toast = useToast();

const $loading = useLoading({
  // options
});

const load = ref(null);

$loader.$on("show", (esMostrar) => {
  console.log('esMostrar', esMostrar)
  if (esMostrar) {
    load.value = $loading.show({
      container: null,
      canCancel: false,
      color: "#000000",
      backgroundColor: "#ffffff",
      loader: "spinner",
      width: 100,
      height: 100,
      opacity: 0.5,
      zIndex: 1000000,
    });
    return;
  }
  if (load.value == null) return;
  load.value.hide();
  load.value = null;
});

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
</template>
