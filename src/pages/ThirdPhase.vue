<script setup>
import { ref } from "vue";
import { Model } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import { surveyLocalization } from "survey-core";

import sectors from "../assets/phase3.json";
import theme from "../assets/survey_theme.json"
import 'survey-core/survey-core.css';
import "survey-core/survey.i18n";

surveyLocalization.defaultLocale = "uk";

const props = defineProps({
  phaseData: Object,
  phaseTitle: String,
  phaseNumber: Number
});
const emit = defineEmits(["phaseComplete"]);
const survey = ref({});

const groupResults = (data) => {
  const ikigai, tools, holes = [], [], [];

  for (const [key, value] of Object.entries(data)) {
    if (value === 24) {
      ikigai.push([key, value]);
    } else if (value >= 16 && value <= 23) {
      tools.push([key, value]);
    } else if (value <= 15) {
      holes.push([key, value])
    } else {
      console.log([key, value]);
    }
  }

  return { ikigai, tools, holes };
}


survey.value = new Model({
  title: props.phaseTitle,
  pages
});
survey.value.applyTheme(theme);

survey.value.onComplete.add((sender) => {
  const sectors = sender.data;
  const professions = props.phaseData.data;
  const result = {};

  for (let prof of professions) {
    if (!result[prof]) {
      result[prof] = 0;
    }

    for (let sector of Object.values(sectors)) {
      result[prof] += sector[prof]
    }
  }
  console.log(result);
});
</script>

<template>
  <SurveyComponent :model="survey" />
</template>

<style scoped>
.sd-page .sd-page__title {
  color: var(--green);
}
</style>