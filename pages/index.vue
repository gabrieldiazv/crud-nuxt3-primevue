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
      :value="proyectos"
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
import { ref, onMounted, watch } from "vue";
import { useDialogoEliminar } from "../composables/useDialogoEliminar";
import { useDialogoCrud } from "../composables/useDialogoCrud";
import { myFetch } from "../composables/myFetch";

const {
  dialogEliminar,
  idEliminar: idProyecto,
  abrirEliminar,
  cerrarDialogEliminar,
} = useDialogoEliminar();

const {
  arrayObj: proyectos,
  objeto: proyecto,
  dialog: dialogProyecto,
  esCrear,
  abrirEditar,
  abrirDialog: abrirDialogProyecto,
  cerrarDialog: cerrarDialogProyecto,
} = useDialogoCrud();

const totalRecords = ref(0);
const buscar = ref("");
const rows = ref(5);
const loading = ref(false);
const options = ref({
  limite: 5,
  desde: 0,
});

const optionsSearchBy = ref({
  limite: 5,
  desde: 0,
});

const setTimeoutSearch = ref(null);

onMounted(async () => {
  initializerProyecto();
});

watch(buscar, (value) => {
  optionsSearchBy.value.desde = 0;
  optionsSearchBy.value.limite = rows.value;

  clearTimeout(setTimeoutSearch.value);
  loading.value = true;
  setTimeoutSearch.value = setTimeout(() => {
    if (value.trim().length > 0) {
      buscarCampo(value);
    } else {
      initializerProyecto();
    }
    loading.value = false;
  }, 1500);
});

const initializerProyecto = async (
  esSort = false,
  sortField = "",
  sortOrder = -1
) => {
  const url = `/proyectos?desde=${options.value.desde}&limite=${options.value.limite}`;
  let res;

  if (esSort) {
    res = await myFetch(`${url}&campo${sortField}&orden${sortOrder}`, {
      method: "GET",
    });
  }

  if (!esSort) {
    res = await myFetch(url, {
      method: "GET",
    });
  }
  // console.log(res);
  proyectos.value = res.proyectos;
  totalRecords.value = res.total;
};

const onPage = ($event) => {
  if (buscar.value.trim().length > 0) {
    optionsSearchBy.value.desde = $event.first;
    optionsSearchBy.value.limite = $event.rows;
    rows.value = $event.rows;
    buscarCampo(buscar.value);
    return;
  }
  options.value.desde = $event.first;
  options.value.limite = $event.rows;
  rows.value = $event.rows;
  initializerProyecto();
};

const onSort = ($event) => {
  initializerProyecto(true, $event.sortField, $event.sortOrder);
};

const buscarCampo = async (campo) => {
  const url = `/proyectos/searchBy?desde=${optionsSearchBy.value.desde}&limite=${optionsSearchBy.value.limite}&search=${campo}`;
  const res = await myFetch(url, {
    method: "GET",
  });
  // console.log(res);
  proyectos.value = res.proyectos;
  totalRecords.value = res.total;
};
</script>
<style>
.p-component-overlay {
  background-color: rgb(226 231 255 / 40%);
}
</style>
