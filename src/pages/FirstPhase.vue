<script setup>
import { ref } from "vue";
import { Model } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import { surveyLocalization } from "survey-core";

import questions from "../assets/phase1.json";
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

const pages = questions.map((q, index) => {
  const basePage = {
    name: `page_${index}`,
    title: `${index + 1} / ${questions.length}`,
    elements: []
  };

  const sharedPanelBase = {
    type: "paneldynamic",
    name: `phase_${props.phaseNumber}_question_${index}`,
    title: q.title ?? "",
    description: q.description ?? "",
    panelCount: 1,
    minPanelCount: q.minAnswers ?? 1,
    maxPanelCount: q.maxAnswers ?? 5,
    isRequired: true,
    confirmDelete: true
  };

  let templateElements;

  switch (q.type) {
    case "text":
      templateElements = [{
        type: "text",
        rows: 2,
        title: "Відповідь:",
        autoGrow: true,
        allowResize: false,
        inputType: "text"
      }];
      break;

    case "bool":
      templateElements = [{
        type: "boolean",
        title: "Відповідь:",
        name: `question_${index}_yn`,
        valueTrue: q.prof,
        valueFalse: ""
      }];
      break;

    default:
      throw new Error(`Unsupported question type "${q.type}" at index ${index}`);
  }

  basePage.elements.push({
    ...sharedPanelBase,
    templateElements
  });

  return basePage;
});

const extractResults = (phase) => {
  return Object.values(phase.data).flatMap(arr => {
    return arr.flatMap(entry => {
      const values = Object.values(entry);
      if (values[0]) {
        return values[0];
      }
    });
  });
};

survey.value = new Model({
  title: props.phaseTitle,
  pages 
});
survey.value.applyTheme(theme);

survey.value.onComplete.add((sender) => {
  const results = extractResults(sender);
  emit("phaseComplete", results);
});
</script>

<template>
  <SurveyComponent :model="survey" />
</template>

<style scoped>
</style>
