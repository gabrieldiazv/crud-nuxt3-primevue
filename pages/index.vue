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
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" />
        </template>
      </Column>
    </DataTable>
  </div>
  <DialogProyecto
    :dialog="dialogProyecto"
    @close-modal="cerrarDialogProyecto"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { myFetch } from "../composables/myFetch";
const proyectos = ref([]);
const dialogProyecto = ref(false);

const abrirDialogProyecto = () => {
  dialogProyecto.value = true;
};

const cerrarDialogProyecto = () => {
  dialogProyecto.value = false;
};

onMounted(async () => {
  const res = await myFetch("/proyectos", {
    method: "GET",
  });
  proyectos.value = res.proyectos;
});
</script>
