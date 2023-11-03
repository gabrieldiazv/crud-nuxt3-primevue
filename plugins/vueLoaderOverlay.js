import { defineNuxtPlugin } from "#app";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("vueLoader", LoadingPlugin);
});
