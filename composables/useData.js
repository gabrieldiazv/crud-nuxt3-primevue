import { ref, onMounted, watch } from "vue";
import { myFetch } from "./myFetch";
export const useData = async (urlData, respuestaData) => {
  const arrayObj = ref([]);
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
    await initializer();
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
        initializer();
      }
      loading.value = false;
    }, 1500);
  });

  const initializer = async (
    esSort = false,
    sortField = "",
    sortOrder = -1
  ) => {
    const url = `/${urlData}?desde=${options.value.desde}&limite=${options.value.limite}`;
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
    arrayObj.value = res[respuestaData];
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
    initializer();
  };

  const onSort = ($event) => {
    initializer(true, $event.sortField, $event.sortOrder);
  };

  const buscarCampo = async (campo) => {
    const url = `/${urlData}/searchBy?desde=${optionsSearchBy.value.desde}&limite=${optionsSearchBy.value.limite}&search=${campo}`;
    const res = await myFetch(url, {
      method: "GET",
    });
    // console.log(res);
    arrayObj.value = res[respuestaData];
    totalRecords.value = res.total;
  };

  // console.log(arrayObj.value);

  return {
    arrayObj,
    initializer,
    totalRecords,
    buscar,
    rows,
    loading,
    onPage,
    onSort,
  };
};
