import { ref } from "vue";

export const useDialogoEliminar = () => {
  const dialogEliminar = ref(false);
  const idEliminar = ref("");

  const abrirEliminar = (id) => {
    idEliminar.value = id;
    dialogEliminar.value = true;
  };

  const cerrarDialogEliminar = () => {
    dialogEliminar.value = false;
  };

  return {
    dialogEliminar,
    idEliminar,
    abrirEliminar,
    cerrarDialogEliminar,
  };
};
