<template>
  <div class="card">
    <div class="flex justify-between mb-4">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText placeholder="Buscar" v-model="buscar" />
      </span>
      <Button
        @click="abrirDialogProyecto"
        class="primary"
        label="Crear Proyectos"
      />
    </div>
    <DataTable
      @sort="onSort($event)"
      :loading="loading"
      :value="usuarios"
      tableStyle="min-width: 50rem"
      dataKey="_id"
      :paginator="true"
      :lazy="true"
      :rows="rows"
      @page="onPage($event)"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} al {last} de {totalRecords}"
    >
      <Column field="nombre" sortable header="Nombre"></Column>
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
      <template #loading>
        <div style="text-align: center; width: 90%">
          <ProgressBar
            mode="indeterminate"
            class="mb-4"
            style="height: 0.5em"
          />
          <p>Cargando, espere por favor…</p>
          <!-- <p>
              <Button label="Cancel" @click="cancelLoading" />
            </p> -->
        </div>
      </template>
    </DataTable>
  </div>
  <DialogProyecto
    :esCrear="esCrear"
    :dialog="dialogProyecto"
    :proyecto="usuario"
    @close-modal="cerrarDialogProyecto"
    @getAllProyect="initializerUsuarios"
  />
  <DialogEliminar
    :mostrarDialog="dialogEliminar"
    header="Eliminar"
    message="¿Está seguro que desea eliminar el usuario?"
    @close-modal="cerrarDialogEliminar"
    url="/usuarios"
    :id="idUsuario"
    :initialize="initializerUsuarios"
  />
</template>

<script setup>
definePageMeta({
  title: "usuarios",
  middleware: "auth",
});

import { useDialogoEliminar } from "../composables/useDialogoEliminar";
import { useDialogoCrud } from "../composables/useDialogoCrud";
import { useData } from "../composables/useData";

const {
  dialogEliminar,
  idEliminar: idUsuario,
  abrirEliminar,
  cerrarDialogEliminar,
} = useDialogoEliminar();

const {
  arrayObj: usuarios,
  initializer: initializerUsuarios,
  totalRecords,
  buscar,
  rows,
  loading,
  onPage,
  onSort,
} = await useData("usuarios", "usuarios");

const {
  objeto: usuario,
  dialog: dialogProyecto,
  esCrear,
  abrirEditar,
  abrirDialog: abrirDialogProyecto,
  cerrarDialog: cerrarDialogProyecto,
} = useDialogoCrud();
</script>
<style>
.p-component-overlay {
  background-color: rgb(226 231 255 / 40%);
}
</style>
