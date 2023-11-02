import { useUserStore } from "../stores/user";

export const myFetch = (request, opts) => {
  const config = useRuntimeConfig();
  const userStore = useUserStore();

  const token = userStore.api_token ?? null;
  

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };


  return $fetch(request, {
    baseURL: config.public.baseURL,
    headers,
    ...opts,
  });
};
