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
    :phaseData="store.phase"
    :phaseTitle="store.currentTitle"
    :phaseNumber="store.currentPhase"
    @phaseComplete="store.finishPhase"
  />
</template>
