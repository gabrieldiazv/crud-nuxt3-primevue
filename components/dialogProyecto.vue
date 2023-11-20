<template>
  <Dialog
    :visible="dialog"
    @update:visible="closeModal"
    modal
    :header="titulo"
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="form-container mt-5">
      <span class="p-float-label w-full">
        <InputText class="w-full" id="nombre" v-model="nombre" />
        <label for="nombre">Nombre</label>
      </span>
      <span class="mt-8 p-float-label w-full">
        <Textarea class="w-full" v-model="descripcion" rows="5" />
        <label>Descripción</label>
      </span>
    </div>
    <template #footer>
      <Button label="cerrar" severity="danger" @click="closeModal" />
      <Button label="guardar" @click="escogerCamino()" />
    </template>
  </Dialog>
</template>
<script setup>
const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  proyecto: {
    type: Object,
    default: () => ({}),
  },
  esCrear: {
    type: Boolean,
    default: true,
  },
});
import { ref, watch } from "vue";
import { myFetch } from "../composables/myFetch";
const { $notification, $loader } = useNuxtApp();
const emit = defineEmits(["closeModal", "getAllProyect"]);
const nombre = ref("");
const descripcion = ref("");
const idProyecto = ref("");

const closeModal = () => emit("closeModal");
const getAllProyect = () => emit("getAllProyect");

watch(
  () => props.proyecto,
  (value, oldValue) => {
    if (props.dialog == true) {
      nombre.value = value.nombre;
      descripcion.value = value.descripcion;
      idProyecto.value = value._id;
      return;
    }

    nombre.value = "";
    descripcion.value = "";
  },
  { deep: true }
);
const escogerCamino = () => {
  if (props.esCrear) {
    crearProyecto();
    return;
  }
  editarProyecto();
};

const editarProyecto = async () => {
  try {
    $loader.$emit("show", true);
    const res = await myFetch(`/proyectos/${idProyecto.value}`, {
      method: "PUT",
      body: {
        nombre: nombre.value,
        descripcion: descripcion.value,
      },
    });
    $notification.$emit("toast", {
      severity: "success",
      summary: "Proyecto editado",
      detail: "El proyecto se ha editado correctamente",
    });

    $loader.$emit("show", false);
    closeModal();
    getAllProyect();
    nombre.value = "";
    descripcion.value = "";

    // console.log(res);
  } catch (error) {
    // console.log(error);
    $notification.$emit("toast", {
      severity: "error",
      summary: "Error al editar el proyecto",
      detail: "Ha ocurrido un error al editar el proyecto",
    });
  } finally {
    $loader.$emit("show", false);
  }
};

// crea una titulo computed segun esCrear
const titulo = computed(() => {
  return props.esCrear ? "Crear proyecto" : "Editar proyecto";
});

const crearProyecto = async () => {
  try {
    $loader.$emit("show", true);
    const res = await myFetch("/proyectos", {
      method: "POST",
      body: {
        nombre: nombre.value,
        descripcion: descripcion.value,
      },
    });
    $notification.$emit("toast", {
      severity: "success",
      summary: "Proyecto creado",
      detail: "El proyecto se ha creado correctamente",
    });
    $loader.$emit("show", false);
    closeModal();
    getAllProyect();
    nombre.value = "";
    descripcion.value = "";
    // console.log(res);
  } catch (error) {
    // console.log(error);
    $notification.$emit("toast", {
      severity: "error",
      summary: "Error al crear el proyecto",
      detail: "Ha ocurrido un error al crear el proyecto",
    });
  } finally {
    $loader.$emit("show", false);
  }
};
</script>
<style>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
