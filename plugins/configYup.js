// configurar yup
import * as yup from "yup";
import validarRut from "~/helpers/validarRut";
import { defineNuxtPlugin } from "#app";
yup.setLocale({
  mixed: {
    required: "Campo requerido",
    notType: "Campo inválido",
  },
  string: {
    email: "E-mail inválido",
  },
});

yup.addMethod(yup.string, "validarRut", function (message) {
  return this.test("validarRut", message, function (rut) {
    if (rut) {
      return validarRut(rut);
    }
    return true;
  });
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("yup", yup);
});
