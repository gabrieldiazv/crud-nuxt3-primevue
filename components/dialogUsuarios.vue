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
            <label for="nickname">Nickname</label>
            <InputText
              :class="errors.nickname ? 'p-invalid' : ''"
              v-bind="nickname"
              id="nickname"
              aria-describedby="nickname-help"
            />
            <small class="text-red-600" id="nickname-help">{{
              errors.nickname ?? ""
            }}</small>
          </div>
        </div>
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
            <label for="password">Password</label>
            <InputText
              :class="errors.password ? 'p-invalid' : ''"
              v-bind="password"
              id="password"
              aria-describedby="password-help"
            />
            <small class="text-red-600" id="password-help">{{
              errors.password ?? ""
            }}</small>
          </div>
        </div>
        <div class="field col-12 md:col-6">
          <div class="flex flex-column gap-2">
            <label for="rol">Rol</label>
            <Dropdown id="rol" v-bind="rol" :options="roles" class="w-full" />
          </div>
        </div>
        <div class="field col-12 md:col-6">
          <div class="flex flex-column gap-2">
            <label for="proyecto">Proyecto</label>
            <Dropdown
              option-value="_id"
              option-label="nombre"
              v-bind="proyecto"
              :options="proyectos"
              class="w-full"
            />
          </div>
        </div>
      </div>
      <!-- <pre>meta: {{ meta }}</pre>
    <pre>errors: {{ errors }}</pre>
    <pre>values: {{ values }}</pre>
    <pre>{{ proyectos }}</pre>
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
  usuario: {
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

const roles = ref([
  "SUPER-ADMIN",
  "ADMINISTRADOR",
  "SUPERVISOR",
  "OFICINA-TECNICA",
]);

const proyectos = ref([]);



const closeModal = () => emit("closeModal");
const getAllProyect = () => emit("getAllProyect");
const {
  values,
  meta,
  errors,
  resetForm,
  setErrors,
  handleSubmit,
  setFieldValue,
  defineComponentBinds
} = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      nickname: yup.string().required(),
      nombre: yup.string().required(),
      apellido: yup.string().required(),
      correo: yup.string().required(),
      password: yup.string().required(),
      rol: yup.string().required(),
      proyecto: yup.string().required(),
    })
  )
})

const nickname = defineComponentBinds("nickname");
const nombre = defineComponentBinds("nombre");
const apellido = defineComponentBinds("apellido");
const correo = defineComponentBinds("correo");
const password = defineComponentBinds("password");
const rol = defineComponentBinds("rol");
const proyecto = defineComponentBinds("proyecto");


watch(
  () => props.usuario,
  (value, oldValue) => {

  },
  { deep: true }
);

const onSubmit = handleSubmit((values) => {
  const { proyecto: pro, ...resto } = values;
  const body = {
    ...resto,
    idProyecto: pro,
  };
  if (props.esCrear) {
    crearUsuario(body);
    return;
  }
  editarUsuario(body);
});

onMounted(async () => {
  await getAllProyectos();
});

const getAllProyectos = async () => {
  try {
    const { proyectos: pro } = await myFetch("/proyectos");
    proyectos.value = pro;
  } catch (error) {
    console.log(error);
  }
};

const editarUsuario = async () => {
  try {
    $loader.$emit("show", true);
    const res = await myFetch(`/usuarios/${idusuario.value}`, {
      method: "PUT",
      body: {
        nombre: nombre.value,
        descripcion: descripcion.value,
      },
    });
    $notification.$emit("toast", {
      severity: "success",
      summary: "usuario editado",
      detail: "El usuario se ha editado correctamente",
    });
    $loader.$emit("show", false);
    closeModal();
    getAllProyect();

    // console.log(res);
  } catch (error) {
    // console.log(error);
    $notification.$emit("toast", {
      severity: "error",
      summary: "Error al editar el usuario",
      detail: "Ha ocurrido un error al editar el usuario",
    });
  } finally {
    $loader.$emit("show", false);
  }
};

// crea una titulo computed segun esCrear
const titulo = computed(() => {
  return props.esCrear ? "Crear usuario" : "Editar usuario";
});

const crearUsuario = async (body) => {
  try {
    $loader.$emit("show", true);

    await myFetch("/usuarios", {
      method: "POST",
      body,
    });
    $notification.$emit("toast", {
      severity: "success",
      summary: "usuario creado",
      detail: "El usuario se ha creado correctamente",
    });
    $loader.$emit("show", false);
    resetForm();
    closeModal();
    getAllProyect();
  } catch (error) {
    // console.log(error);
    $notification.$emit("toast", {
      severity: "error",
      summary: "Error al crear el usuario",
      detail: "Ha ocurrido un error al crear el usuario",
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
