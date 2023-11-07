<template>
  <div class="card">
    <DataTable
      :value="proyectos"
      tableStyle="min-width: 50rem"
      dataKey="_id"
      :paginator="true"
      :rows="10"
    >
      <template #header>
        <div class="flex justify-between">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText placeholder="Keyword Search" />
          </span>
          <Button
            @click="abrirDialogProyecto"
            class="primary"
            label="Crear Proyectos"
          />
        </div>
      </template>
      <Column field="nombre" header="Nombre"></Column>
      <Column field="descripcion" header="Descripción"></Column>
      <Column header="Acciones" :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <Button
            @click="abrirEditar(slotProps)"
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
          />
          <Button @click="abrirEliminar(slotProps)" icon="pi pi-trash" outlined rounded severity="danger" />
        </template>
      </Column>
    </DataTable>
  </div>
  <DialogProyecto
    :esCrear="esCrear"
    :dialog="dialogProyecto"
    :proyecto="proyecto"
    @close-modal="cerrarDialogProyecto"
    @getAllProyect="initializerProyecto"
  />
  <DialogEliminar 
    :mostrarDialog="dialogEliminar"
    header="Eliminar"
    message="¿Está seguro que desea eliminar el proyecto?"
    @close-modal="cerrarDialogEliminar"
    url="/proyectos"
    :id="idProyecto"
    :initialize="initializerProyecto"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { myFetch } from "../composables/myFetch";
const proyectos = ref([]);
const proyecto = ref({});
const dialogProyecto = ref(false);
const esCrear = ref(true);
const dialogEliminar = ref(false);
const idProyecto = ref("");


onMounted(async () => {
  initializerProyecto();
});

const initializerProyecto = async () => {
  const res = await myFetch("/proyectos", {
    method: "GET",
  });
  proyectos.value = res.proyectos;
};

const abrirEditar = (item) => {
  esCrear.value = false;
  proyecto.value = item.data;
  dialogProyecto.value = true;
  console.log(proyecto.value); 
};

const abrirEliminar = (item) => {
  console.log(item.data);
  idProyecto.value = item.data._id;
  dialogEliminar.value = true;
};

const cerrarDialogEliminar = () => {
  dialogEliminar.value = false;
};

const abrirDialogProyecto = () => {
  esCrear.value = true;
  proyecto.value = {};
  dialogProyecto.value = true;
};

const cerrarDialogProyecto = () => {
  dialogProyecto.value = false;
};
</script>
