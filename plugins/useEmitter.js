import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'
const emitter = mitt()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('notification', {
    $on: emitter.on,
    $emit: emitter.emit,
  })
})