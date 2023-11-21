import { defineStore } from "pinia";
import { myFetch } from "~/composables/myFetch";
export const useUserStore = defineStore("user", {
  state: () => ({
    id: "",
    user: {},
    isLoggedIn: false,
    api_token: "",
    tiempoExpiracion: 0,
  }),
  actions: {
    async login(nickname, password) {
      const { token, usuario, tiempoExpiracion } = await myFetch("/auth/login", {
        method: "POST",
        body: { nickname: nickname, password: password },
      });

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", usuario);
      localStorage.setItem("tiempoExpiracion", tiempoExpiracion);
      this.$state.id = usuario._id;
      this.$state.user = usuario;
      this.$state.api_token = token;
      this.$state.tiempoExpiracion = tiempoExpiracion;
      this.$state.isLoggedIn = true;
    },

    async register(name, email, password, confirmPassword) {
      await $axios.post("/api/register", {
        full_name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword
      });
    },

    async getUser() {
      let res = await $axios.get("/api/user");
      this.$state.id = res.data.data.id;
      this.$state.full_name = res.data.data.full_name;
      this.$state.email = res.data.data.email;
      this.$state.isLoggedIn = true;
    },

    async verificarToken() {
      const token = localStorage.getItem("token");
      const config = useRuntimeConfig();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      }
      const {usuario, token:tk, tiempoExpiracion} = await $fetch("/auth/refresh", {
        method: "POST",
        baseURL: config.public.baseURL,
        headers,
      })

      localStorage.setItem("token", tk);
      localStorage.setItem("usuario", usuario);
      localStorage.setItem("tiempoExpiracion", tiempoExpiracion);
      this.$state.id = usuario._id;
      this.$state.user = usuario;
      this.$state.api_token = tk;
      this.$state.tiempoExpiracion = tiempoExpiracion;
      this.$state.isLoggedIn = true;
      
    },

    async logout() {
      // await $axios.post('/api/logout')
      this.resetState();
    },

    resetState() {
      console.log('reset state');
      localStorage.removeItem("token");
      this.$state.id = "";
      this.$state.user = {};
      this.$state.api_token = "";
      this.$state.tiempoExpiracion = 0;
      this.$state.isLoggedIn = false;
    },
  },
  persist: true,
});
