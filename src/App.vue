<script setup>
import { computed } from "vue";
import { useStore } from "./store"

import FirstPhase from './pages/FirstPhase.vue';
import SecondPhase from './pages/SecondPhase.vue';
import ThirdPhase from './pages/ThirdPhase.vue';


const store = useStore();
const components = [FirstPhase, SecondPhase, ThirdPhase];
const CurrentPhase = computed(() => components[store.currentPhase]);

</script>

<template>
  <component 
    :is="CurrentPhase"
    :key="store.currentPhase"
    :initialData="store.collectedData"
    @phaseComplete="store.completePhase"
  />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
