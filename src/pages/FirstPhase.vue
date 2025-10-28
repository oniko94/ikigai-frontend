<script setup>
import { onMounted, ref } from "vue";
import { Model } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import { surveyLocalization } from "survey-core";
import questions from "../assets/phase1.json";
import theme from "../assets/survey_theme.json"
import 'survey-core/survey-core.css';
import "survey-core/survey.i18n";

surveyLocalization.defaultLocale = "uk";

const props = defineProps({initialData: Object});
const emit = defineEmits(["phaseComplete"]);
const survey = ref({});

const pages = questions.map(q => {
  let index = questions.indexOf(q);
  const page = {
    name: `question_${index}`,
    elements: []
  };
  if (q.type === "text") {
    page.elements.push({
      type: "paneldynamic",
      title: q.title,
      description: q.description,
      panelCount: 1,
      minPanelCount: q.minAnswers,
      maxPanelCount: 5,
      confirmDelete: true,
      isRequired: true,
      templateElements: [{
        type: "text",
        rows: 2,
        title: "Відповідь: ",
        autoGrow: true,
        allowResize: false,
        inputType: "text"
      }]
    });
  } else if (q.type === "bool") {       
    page.elements.push({
      name: `p1_q_${index}`,
      type: "paneldynamic",
      title: q.title,
      description: q.description,
      state: "expanded",
      minPanelCount: q.minAnswers,
      panelCount: 1,
      isRequired: true,
      templateElements: [{
        type: "boolean",
        title: "Відповідь: ",
        name: `p1_q_${index}_yn`,
        valueTrue: q.prof,
        valueFalse: ""
      }]
    });
  }
  return page; 
});

survey.value = new Model({ pages });
survey.value.applyTheme(theme);

survey.value.onComplete.add((sender) => {
  emit("phaseComplete", sender.data);
});
</script>

<template>
  <SurveyComponent :model="survey" />
</template>

<style scoped>
</style>
