<template>
  <Dialog
    :visible="dialog"
    @update:visible="closeModal"
    modal
    header="Header"
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="form-container">
      <span class="p-float-label w-full">
        <InputText class="w-full" id="username" />
        <label for="username">Username</label>
      </span>
      
    </div>
    <template #footer>
      <Button label="Ok" icon="pi pi-check" @click="closeModal" autofocus />
    </template>
  </Dialog>
</template>
<script setup>
const emit = defineEmits(["closeModal"]);

defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
});

const closeModal = () => {
  emit("closeModal");
};
</script>
<style>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin-top: 1rem;
}
</style>
