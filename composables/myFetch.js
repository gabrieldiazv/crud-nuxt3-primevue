import { useUserStore } from "../stores/user";

export const myFetch = async (request, opts) => {
  const dayjs = useDayjs();
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const tiempoExpiracion = userStore.tiempoExpiracion;

  const token = userStore.api_token ?? null;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };

  if (tiempoExpiracion != 0) {
    // fecha actual menos 30 segundos de margen

    const tiempoActual = dayjs();

    const tiempoExpiracionFormatted = dayjs.unix(tiempoExpiracion);

    const tiempoMargenInicio = tiempoExpiracionFormatted.subtract(
      1,
      "days"
    );

    // console.log("tiempo actual", tiempoActual.format("YYYY-MM-DD HH:mm:ss"));
    // console.log("tiempo expiry", tiempoExpiracionFormatted.format("YYYY-MM-DD HH:mm:ss"));
    // console.log("tiempo margen inicio", tiempoMargenInicio.format("YYYY-MM-DD HH:mm:ss"));

    if(tiempoActual.isAfter(tiempoExpiracionFormatted)){
      userStore.resetState();
      return navigateTo("/login");
    }


    if (tiempoActual.isBetween(tiempoMargenInicio, tiempoExpiracionFormatted)) {
      console.log("renovar token");
      const { usuario, token, tiempoExpiracion:TE } = await $fetch("/auth/refresh", {
        method: "POST",
        baseURL: config.public.baseURL,
        headers,
      });

      userStore.user = usuario;
      userStore.api_token = token;
      userStore.tiempoExpiracion = TE;
      userStore.isLoggedIn = true;
    }

    // if (
    //   dayjs(tiempoExpiracionFormatted).isAfter(fechaActualInicioTiempoMargen)
    // ) {
    //   // renovar token
    //   console.log("renovar token");
    // }
  }

  return $fetch(request, {
    baseURL: config.public.baseURL,
    headers,
    ...opts,
  });
};
