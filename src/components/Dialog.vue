<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
  isOpen: Boolean
});
const emit = defineEmits(["modal-close"]);

const target = ref(null);

onClickOutside(target, () => emit("modal-close"));
</script>

<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper">
        <div class="modal-container" ref="target">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <div class="modal-btn-container">
                <button class="sd-btn" @click.stop="emit('modal-close')">ОК</button>
              </div>
            </slot>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal-container {
    width: 300px;
    margin: 150px auto;
    padding: 20px 30px;
    background: linear-gradient(180deg, var(--white) 50%, var(--beige) 100%);
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  }
  .modal-btn-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  }
</style>