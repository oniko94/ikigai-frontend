<script setup>
import { ref } from "vue";
import { Model } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import { surveyLocalization } from "survey-core";

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
const selectedCount = ref(0);
const limit = 21;


survey.value = new Model({
  title: props.phaseTitle,
  elements: [{
    type: "html",
    name: "counter",
    html: '<div class="counter-container"><h2 style="color: {counterColor}">{currentCount} / 21</h2></div>'
  },{
    type: "checkbox",
    name: `phase_${props.phaseNumber}`,
    title: "Обери найрелевантніші для тебе професії:",
    choices: props.phaseData.data.filter(val => val && val !== undefined),
    isRequired: true,
    colCount: 3,
    maxSelectedChoices: limit,
    minSelectedChoices: limit,
    showNoneItem: false,
    showOtherItem: false,
    showSelectAllItem: false,
    separateSpecialChoices: true,
    validators: [{
      type: "answercount",
      minCount: limit,
      maxCount: limit,
      text: "Необхідно вибрати рівно 21 варіант."
    }]
  }],
  calculatedValues: [{
    name: "counterColor",
    expression: "iif({selectedCount} == {limit}, 'var(--green)', 'var(--red)')",
    includeIntoResult: false
  }, {
    name: "currentCount",
    expression: "{selectedCount} or 0",
    includeIntoResult: false
  }]
});
survey.value.setVariable("limit", limit);
survey.value.applyTheme(theme);

survey.value.onValueChanged.add((sender) => {
  const values = sender.data[`phase_${props.phaseNumber}`] || [];
  selectedCount.value = values.length;
  survey.value.setVariable("selectedCount", selectedCount.value);
});

survey.value.onComplete.add((sender) => {
  const results = sender.data[`phase_${props.phaseNumber}`];
  emit("phaseComplete", results);
});
</script>

<template>
  <SurveyComponent :model="survey" />
</template>

<style scoped>
  .counter-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }
</style>