<template>
  <Dialog
    :visible="dialog"
    @update:visible="closeModal"
    modal
    :header="titulo"
    :style="{ width: '80rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <form @submit="onSubmit">
      <div class="formgrid grid">
        <div class="field col-12 md:col-6">
          <div class="flex flex-column gap-2">
            <label for="nombre">Nombre</label>
            <InputText
              :class="errors.nombre ? 'p-invalid' : ''"
              v-bind="nombre"
              id="nombre"
              aria-describedby="nombre-help"
            />
            <small class="text-red-600" id="nombre-help">{{
              errors.nombre ?? ""
            }}</small>
          </div>
        </div>
        <div class="field col-12 md:col-6">
          <div class="flex flex-column gap-2">
            <label for="apellido">Apellido</label>
            <InputText
              :class="errors.apellido ? 'p-invalid' : ''"
              v-bind="apellido"
              id="apellido"
              aria-describedby="apellido-help"
            />
            <small class="text-red-600" id="apellido-help">{{
              errors.apellido ?? ""
            }}</small>
          </div>
        </div>
        <div class="field col-12 md:col-6">
          <div class="flex flex-column gap-2">
            <label for="correo">Correo</label>
            <InputText
              :class="errors.correo ? 'p-invalid' : ''"
              v-bind="correo"
              id="correo"
              aria-describedby="correo-help"
            />
            <small class="text-red-600" id="correo-help">{{
              errors.correo ?? ""
            }}</small>
          </div>
        </div>
        <div class="field col-12 md:col-6">
          <div class="flex flex-column gap-2">
            <label for="rut">Rut</label>
            <InputText
              :class="errors.rut ? 'p-invalid' : ''"
              v-bind="rut"
              id="rut"
              aria-describedby="rut-help"
            />
            <small class="text-red-600" id="rut-help">{{
              errors.rut ?? ""
            }}</small>
          </div>
        </div>
        <div class="field col-12 md:col-6">
          <div class="flex flex-column gap-2">
            <label for="telefono">Telefono</label>
            <InputText
              :class="errors.telefono ? 'p-invalid' : ''"
              v-bind="telefono"
              id="telefono"
              aria-describedby="telefono-help"
            />
            <small class="text-red-600" id="telefono-help">{{
              errors.telefono ?? ""
            }}</small>
          </div>
        </div>
        <div class="field col-12 md:col-6">
          <div class="flex flex-column gap-2">
            <label for="rol">Rol</label>
            <Dropdown
              option-value="_id"
              option-label="nombre"
              v-bind="rol"
              id="rol"
              :options="roles"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- <pre>meta: {{ meta }}</pre>
      <pre>errors: {{ errors }}</pre>
      <pre>values: {{ values }}</pre>
      <pre>{{ telefonos }}</pre>
      <pre>{{ roles }}</pre> -->
      <div class="flex flex-row-reverse flex-wrap mt-3">
        <Button
          type="submit"
          :disabled="!meta.valid"
          class="ml-3"
          label="guardar"
        />
        <Button label="cerrar" severity="danger" @click="closeModal" />
      </div>
    </form>
  </Dialog>
</template>
<script setup>
const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  trabajador: {
    type: Object,
    default: () => ({}),
  },
  esCrear: {
    type: Boolean,
    default: true,
  },
});
import { ref, watch, onMounted } from "vue";
import { myFetch } from "../composables/myFetch";
const { $notification, $loader } = useNuxtApp();
const emit = defineEmits(["closeModal", "getAllProyect"]);
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";

const roles = ref([]);

const closeModal = () => emit("closeModal");
const getAllProyect = () => emit("getAllProyect");

const schema = ref(
  toTypedSchema(
    yup.object({
      nombre: yup.string().required(),
      apellido: yup.string().required(),
      correo: yup.string().email().required(),
      rut: yup.string().required().validarRut("rut invalido"),
      telefono: yup.string().required(),
      rol: yup.string().required(),
    })
  )
);

const {
  values,
  meta,
  errors,
  resetForm,
  setErrors,
  handleSubmit,
  setFieldValue,
  defineComponentBinds,
} = useForm({
  validationSchema: schema.value,
});

const nombre = defineComponentBinds("nombre");
const apellido = defineComponentBinds("apellido");
const rut = defineComponentBinds("rut");
const telefono = defineComponentBinds("telefono");
const correo = defineComponentBinds("correo");
const rol = defineComponentBinds("rol");

watch(
  () => props.trabajador,
  (value, oldValue) => {
    if (!props.esCrear) {
      const { nombre, apellido, rut, telefono, correo, idRolTrabajador } =
        value;
      setFieldValue("nombre", nombre);
      setFieldValue("apellido", apellido);
      setFieldValue("rut", rut);
      setFieldValue("telefono", telefono);
      setFieldValue("correo", correo);
      setFieldValue("rol", idRolTrabajador._id);
      return;
    }
    resetForm();
  },
  { deep: true }
);

const onSubmit = handleSubmit((values) => {
  const { rol, ...resto } = values;
  const body = {
    idRolTrabajador: rol,
    ...resto,
  };
  console.log(body);
  if (props.esCrear) {
    crearTrabajador(body);
    return;
  }
  editarTrabajador(body);
});

onMounted(async () => {
  await getAllRoles();
});

const getAllRoles = async () => {
  try {
    const { rolTrabajador } = await myFetch(
      "/rolTrabajador?limite=1000&desde=0"
    );

    roles.value = rolTrabajador;
  } catch (error) {
    console.log(error);
  }
};

const editarTrabajador = async (body) => {
  try {
    $loader.$emit("show", true);
    const res = await myFetch(`/trabajadores/${props.trabajador._id}`, {
      method: "PUT",
      body,
    });
    $notification.$emit("toast", {
      severity: "success",
      summary: "trabajador editado",
      detail: "El trabajador se ha editado correctamente",
    });

    $loader.$emit("show", false);
    closeModal();
    getAllProyect();

    // console.log(res);
  } catch (error) {
    // console.log(error);
    $notification.$emit("toast", {
      severity: "error",
      summary: "Error al editar el trabajador",
      detail: "Ha ocurrido un error al editar el trabajador",
    });
  } finally {
    $loader.$emit("show", false);
  }
};

// crea una titulo computed segun esCrear
const titulo = computed(() => {
  return props.esCrear ? "Crear trabajador" : "Editar trabajador";
});

const crearTrabajador = async (body) => {
  try {
    $loader.$emit("show", true);

    await myFetch("/trabajadores", {
      method: "POST",
      body,
    });
    $notification.$emit("toast", {
      severity: "success",
      summary: "trabajador creado",
      detail: "El trabajador se ha creado correctamente",
    });
    $loader.$emit("show", false);
    resetForm();
    closeModal();
    getAllProyect();
  } catch (error) {
    // console.log(error);
    $notification.$emit("toast", {
      severity: "error",
      summary: "Error al crear el trabajador",
      detail: "Ha ocurrido un error al crear el trabajador",
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
