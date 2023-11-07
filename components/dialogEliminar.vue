<template>
  <ConfirmDialog group="templating">
    <template #message="slotProps">
      <div
        class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border"
      >
        <i
          :class="slotProps.message.icon"
          class="text-6xl text-primary-500"
        ></i>
        <p>{{ slotProps.message.message }}</p>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup>
import { useConfirm } from "primevue/useconfirm";
import { myFetch } from "../composables/myFetch";
const { $notification, $loader } = useNuxtApp();
const confirm = useConfirm();

const props = defineProps({
  mostrarDialog: {
    type: Boolean,
    default: false,
  },
  header: {
    type: String,
    default: "Eliminar",
  },
  message: {
    type: String,
    default: "¿Está seguro que desea eliminar esto ...?",
  },
  url: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  initialize: {
    type: Function,
    default: () => {},
  },
});

watch(
  () => props.mostrarDialog,
  (value, oldValue) => {
    if (value) {
      showTemplate();
    }
  },
  { deep: true }
);

const emit = defineEmits(["close-modal"]);

const showTemplate = () => {
  confirm.require({
    group: "templating",
    header: props.header,
    message: props.message,
    icon: "pi pi-exclamation-circle",
    acceptIcon: "pi pi-check",
    rejectIcon: "pi pi-times",
    rejectClass: "p-button-sm",
    acceptClass: "p-button-outlined p-button-sm",

    acceptLabel: "Aceptar",
    rejectLabel: "Cancelar",
    accept: () => {
      confirmarEliminar();
    },
    reject: () => {
      emit("close-modal");
    },
  });
};

const confirmarEliminar = async () => {
  try {
    $loader.$emit("show", true);
    await myFetch(`${props.url}/${props.id}`, {
      method: "DELETE",
    });

    $notification.$emit("toast", {
      severity: "success",
      summary: "Éxito",
      detail: "Se ha eliminado correctamente",
    });
    props.initialize();
    $loader.$emit("show", false);
    emit("close-modal");
  } catch (error) {
    console.log(error);
  } finally {
    $loader.$emit("show", false);
  }
};
</script>
