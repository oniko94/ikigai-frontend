<script setup>
import { computed } from "vue";

const props = defineProps({
  model: Object
});

const sector = computed(() => {
  return `Сектор ${props.model.currentSector}` || "";
});

const value = computed(() => {
  return props.model.sectorProgressValue + "%";
});

const page = computed(() => {
  return `(${props.model.sectorCurrentPageNo})` || "";
});
</script>

<template>
  <div class="sv-progressbar">
    <div class="sv-progressbar-percentage__title">
      <span>{{ sector }}</span>
    </div>
    <div class="sv-progressbar__indicator">
      <div class="sv-progressbar__value-bar" :style="{ width: value }"></div>
    </div>
    <div class="sv-progressbar__value">
      <span class="percentage">{{ value }}</span>
      <span class="page-no">{{ page }}</span>
    </div>
  </div>
</template>

<style scoped>
.sv-progressbar {
    display: flex;
    flex-direction: row;
    gap: 16px;
    line-height: 32px;
    padding: 24px;
    border-radius: 6px;
    box-shadow: var(--sjs-shadow-small, 0px 1px 2px 0px rgba(0, 0, 0, 0.15));
    background: var(--sjs-questionpanel-backcolor, var(--sjs-question-background, var(--sjs-general-backcolor, var(--background, #fff))));
    margin-bottom: 24px;
    justify-content: center;
    align-items: center;
    color: var(--sjs-font-questiontitle-color, var(--sjs-general-forecolor, var(--foreground, #161616)));
}

.sd-root--compact .sv-progressbar {
    box-shadow: none;
    border: 1px solid var(--sjs-border-default, #d6d6d6);
}

.sv-progressbar-percentage__title {
    font-family: "Haval", sans-serif;
    font-size: calc(var(--sjs-font-size) * 1.25);
    color: var(--sjs-font-questiondescription-color, var(--sjs-general-forecolor-light, rgba(0, 0, 0, 0.45)));
    font-weight: 600;
    display: flex;
}

.sv-progressbar__indicator {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 50%;
    height: 32px;
    box-shadow: var(--sjs-shadow-small, 1px 1px 1px 1px rgba(0, 0, 0, 0.15));
    border-radius: 9999px;
    background: var(--sjs-general-backcolor-dim-dark, #19b394);
    height: 16px;
}

.sv-progressbar__value-bar {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 9999px;
    border: 1px solid var(--sjs-primary-backcolor, #19b394);
    background: var(--sjs-primary-backcolor, #19b394);
    height: 16px;
}

.sv-progressbar__value {
    font-size: var(--sjs-font-size);
    display: flex;
}
.sv-progressbar__value .percentage {
  font-weight: 600;
}
.sv-progressbar__value .page-no {
  color: var(--sjs-font-questiondescription-color, var(--sjs-general-forecolor-light, rgba(0, 0, 0, 0.45)));
  margin-left: var(--sjs-base-unit, var(--base-unit, 8px));
}

.sd-page .sd-body__page .sd-page__title {
  display: none;  
}
</style>