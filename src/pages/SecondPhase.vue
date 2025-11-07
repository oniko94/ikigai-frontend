<script setup>
import { ref } from "vue";
import { Model } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import { surveyLocalization } from "survey-core";
import * as animations from "../animations";

import theme from "../assets/theme.json"
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
const doAnimation = ref(true);
const selectedCount = ref(0);
const limit = 21;


survey.value = new Model({
  title: props.phaseTitle,
  elements: [{
    type: "html",
    name: "counter",
    html: '<div class="counter-container"><h3 style="color: {counterColor}">{currentCount} / {limit}</h3></div>'
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

/* Survey body fade-in animation when starting the phase */
survey.value.onAfterRenderSurvey.add(() => {
  if (!doAnimation.value) return;

  animations.showBody();
});

survey.value.onValueChanged.add((sender) => {
  const values = sender.data[`phase_${props.phaseNumber}`] || [];
  selectedCount.value = values.length;
  survey.value.setVariable("selectedCount", selectedCount.value);
});

survey.value.onCompleting.add((sender, options) => {
  if (!doAnimation.value) return;
  options.allowComplete = false;
 
  animations.hideBody();
  animations.showLoader();  
    
  setTimeout(() => {
    doAnimation.value = false;
    animations.hideLoader();
    doAnimation.value = true;
  }, 1500);
  options.allowComplete = true;
});

survey.value.onComplete.add((sender) => {
  const results = sender.data[`phase_${props.phaseNumber}`];
  emit("phaseComplete", results);
});
</script>

<template>
  <SurveyComponent :model="survey" />
</template>
