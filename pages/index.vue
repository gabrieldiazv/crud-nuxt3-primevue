<template>
  <div class="card">
    <DataTable
      :value="proyectos"
      tableStyle="min-width: 50rem"
      dataKey="_id"
      :paginator="true"
      :lazy="true"
      :rows="5"
      @page="onPage($event)"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} de {totalRecords}"
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
            @click="abrirEditar(slotProps.data)"
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
          />
          <Button
            @click="abrirEliminar(slotProps.data._id)"
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
          />
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
import { dialogoEliminar, dialogoCrud, myFetch } from "../composables";

const {
  dialogEliminar,
  idEliminar: idProyecto,
  abrirEliminar,
  cerrarDialogEliminar,
} = dialogoEliminar();

const {
  arrayObj: proyectos,
  objeto: proyecto,
  dialog: dialogProyecto,
  esCrear,
  abrirEditar,
  abrirDialog: abrirDialogProyecto,
  cerrarDialog: cerrarDialogProyecto,
} = dialogoCrud();

const totalRecords = ref(0);
const options = ref({
  limite: 5,
  desde: 0,
});

onMounted(async () => {
  initializerProyecto();
});

const initializerProyecto = async () => {
  const res = await myFetch(
    `/proyectos?desde=${options.value.desde}&limite=${options.value.limite}`,
    {
      method: "GET",
    }
  );
  console.log(res);
  proyectos.value = res.proyectos;
  totalRecords.value = res.total;
  console.log(typeof totalRecords.value);
};

const onPage = ($event) => {
  console.log($event);
  options.value.desde = $event.first;
  options.value.limite = $event.rows;
  initializerProyecto();
};
</script>
