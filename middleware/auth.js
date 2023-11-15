import { useUserStore } from "../stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  console.log("isLogin", userStore.isLoggedIn);
  console.log(to.path);
  if (to.path == "/login" && userStore.isLoggedIn) {
    return navigateTo("/");
  }

  if (to.path !== "/login" && !userStore.isLoggedIn) {
    console.log('no esta logueado')
    return navigateTo("/login");
  }
});
