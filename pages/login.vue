<script setup>
definePageMeta({
  layout: "blank",
  title: "Login",
  middleware: "auth",
});

import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import isOnline from "../helpers/isOnline";
const { $notification } = useNuxtApp();
const router = useRouter();
const userStore = useUserStore();

const password = ref("");
const nickname = ref("");

onMounted(async () => {
  await verificarToken();
});

const verificarToken = async () => {
  const tieneInternet = isOnline();
  if (tieneInternet) {
    try {
      console.log(tieneInternet);
      await userStore.verificarToken();
      const user = userStore.user;
      console.log(user);
      if (user.rol == "ADMINISTRADOR") {
        router.push("/trabajadores");
        return;
      }

      if (user.rol == "SUPER-ADMIN") {
        router.push("/");
        return;
      }
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }
};

const login = async () => {
  console.log("login");
  console.log(password.value);
  console.log(nickname.value);
  try {
    await userStore.login(nickname.value, password.value);
    router.push("/");
  } catch (error) {
    // console.log(error);
    $notification.$emit("toast", {
      severity: "error",
      summary: "Error Login",
      detail: "credeciales incorrectas",
    });
  }
};
</script>

<template>
  <section class="bg-gray-50 light:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 light:text-white"
      >
        <img
          class="w-8 h-8 mr-2"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        Flowbite
      </a>
      <div
        class="w-full bg-white rounded-lg shadow light:border md:mt-0 sm:max-w-md xl:p-0 light:bg-gray-800 light:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl light:text-white"
          >
            Sign in to your account
          </h1>
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label
                for="nickname"
                class="block mb-2 text-sm font-medium text-gray-900 light:text-white"
                >Nickname</label
              >
              <input
                v-model="nickname"
                name="nickname"
                id="nickname"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 light:text-white"
                >Contraseña</label
              >
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                required=""
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 light:bg-gray-700 light:border-gray-600 light:focus:ring-primary-600 light:ring-offset-gray-800"
                    :required="false"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label
                    for="remember"
                    class="text-gray-500 light:text-gray-300"
                    >Remember me</label
                  >
                </div>
              </div>
              <a
                href="#"
                class="text-sm font-medium text-primary-600 hover:underline light:text-primary-500"
                >Forgot password?</a
              >
            </div>
            <button
              @click.prevent="login"
              class="w-full text-white bg-cyan-950 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Sign in
            </button>
            <p class="text-sm font-light text-gray-500 light:text-gray-400">
              Don’t have an account yet?
              <a
                href="#"
                class="font-medium text-primary-600 hover:underline light:text-primary-500"
                >Sign up</a
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
