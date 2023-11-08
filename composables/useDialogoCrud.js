import { ref } from "vue";

export const useDialogoCrud = () => {
  const arrayObj = ref([]);
  const objeto = ref({});
  const dialog = ref(false);
  const esCrear = ref(true);

  const abrirEditar = (obj) => {
    esCrear.value = false;
    objeto.value = obj;
    dialog.value = true;
  };

  const abrirDialog = () => {
    esCrear.value = true;
    objeto.value = {};
    dialog.value = true;
  };

  const cerrarDialog = () => {
    dialog.value = false;
  };

  return {
    arrayObj,
    objeto,
    dialog,
    esCrear,
    abrirEditar,
    abrirDialog,
    cerrarDialog,
  };
};
