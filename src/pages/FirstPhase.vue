<script>
/* Validate to ensure no duplicate values in the page panels */
const validateNoDupAnswers = (panel) => {
  if (!Array.isArray(panel)) return true;

  const questions = panel[0] || [];
  const fieldName = panel[1] || "";

  const answers = questions.map((item) => {
    if (!item) return "";
    const raw = item[fieldName];

    if (typeof raw === "string") {
      return raw.trim().toLowerCase();
    }

    if (raw === undefined || raw === null) {
      return "";
    }

    return String(raw).trim().toLowerCase();
  });

  const hasDuplicates = answers.some((val, i) => answers.indexOf(val) !== i);
  return !hasDuplicates;
};

/* Validate to ensure no empty inputs are left in the question page */
const validateNoEmptyAnswers = (panel) => {
  if (!Array.isArray(panel)) return true;

  const questions = panel[0] || [];
  const answers = getFlatValuesArray(questions);

  const hasEmptyFields = answers.length < questions.length;
  return !hasEmptyFields;
}
</script>

<script setup>
import { capitalize, ref } from "vue";
import { Model } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import { FunctionFactory, surveyLocalization } from "survey-core";
import Dialog from '../components/Dialog.vue';
import * as animations from "../animations";
import { getFlatValuesArray } from "../utils";

import questions from "../assets/phase1.json";
import theme from "../assets/theme.json";
import 'survey-core/survey-core.css';
import "survey-core/survey.i18n";

surveyLocalization.defaultLocale = "uk";

const props = defineProps({
  phaseData: Object,
  phaseTitle: String,
  phaseNumber: Number
});
const emit = defineEmits(["phaseComplete"]);
const survey = ref(Model);
const pages = ref([]);
const doAnimation = ref(true);
const showDialog = ref(false);
const dialogMessage = ref("");

const openDialog = (msg) => {
  dialogMessage.value = msg;
  showDialog.value = true;
}

const closeDialog = () => {
  dialogMessage.value = "";
  showDialog.value = false;
};


// Register the custom validators
FunctionFactory.Instance.register("validateNoDupAnswers", validateNoDupAnswers);
FunctionFactory.Instance.register("validateNoEmptyAnswers", validateNoEmptyAnswers);

/* Populate page questions */
pages.value = questions.map((q, index) => {
  const pageBase = {
    name: `page_${index}`,
    title: `${index + 1} / ${questions.length}`,
    elements: []
  };
  const fieldName = `question_${index}`; 

  const panelBase = {
    type: "paneldynamic",
    name: `page_${index}_question_${index}`,
    title: q.title ?? "",
    description: q.description ?? "",
    panelCount: 1,
    minPanelCount: q.minAnswers ?? 1,
    maxPanelCount: q.maxAnswers ?? 7,
    isRequired: true,
    confirmDelete: true
  };

  if (q.type === "text") {
      panelBase.templateElements = [{
        type: "text",
        rows: 2,
        name: fieldName,
        title: "Відповідь:",
        autoGrow: true,
        allowResize: false,
        inputType: "text",
        defaultValue: ""
      }];
      panelBase.validators = [{
        type: "expression",
        text: "Відповіді не мають повторюватися.",
        expression: `validateNoDupAnswers({${panelBase.name}}, "${fieldName}")`
      }, {
        type: "expression",
        text: "Потрібно заповнити всі поля.",
        expression: `validateNoEmptyAnswers({${panelBase.name}}, "${fieldName}")`
      }];
  } else if (q.type === "bool") {
      panelBase.templateElements = [{
        type: "boolean",
        title: "Відповідь:",
        name: `${fieldName}_yn`,
        valueTrue: q.prof,
        valueFalse: ""
      }];
  }

  pageBase.elements.push(panelBase);

  return pageBase;
});

/* Initialize the game phase survey */
survey.value = new Model({
  autoAdvanceAllowComplete: false,
  title: props.phaseTitle,
  pages: pages.value
});
survey.value.applyTheme(theme);

/* Survey body fade-in animation when starting the phase */
survey.value.onAfterRenderSurvey.add(() => {
  if (!doAnimation.value) return;

  animations.showBody();
});

/* Page slide animation */
survey.value.onCurrentPageChanging.add((sender, options) => {
  if (!doAnimation.value) return;

  options.allow = false;
  animations.hidePage();

  setTimeout(() => {
    doAnimation.value = false;
    sender.currentPage = options.newCurrentPage;
    animations.showPage();
    doAnimation.value = true;
  }, 400);
});

/* Unique values validation */
survey.value.onCompleting.add((sender, options) => {
  if (!doAnimation.value) return;
  options.allowComplete = false;
 
  const minUniqAnswers = 21;
  const answers = getFlatValuesArray(sender.data);
  const uniqAnswers = [...new Set(answers.map(val => val.toLowerCase()))];

  if (uniqAnswers.length < minUniqAnswers) {
    openDialog("Деякі ваші відповіді повторювалися і не були зараховані. Зарахованих відповідей недостатньо для переходу до фази фільтрації координат. Будь ласка, поверніться назад та додайте нові відповіді, щоб продовжити.");
  } else {
    animations.hideBody();
    animations.showLoader();  
    
    setTimeout(() => {
      doAnimation.value = false;
      animations.hideLoader();
      doAnimation.value = true;
    }, 1500);
    options.allowComplete = true;
  }
});

survey.value.onComplete.add((sender) => {
  const answers = getFlatValuesArray(sender.data);
  const uniqAnswers = [...new Set(answers.map(val => val.toLowerCase()))];
  emit("phaseComplete", uniqAnswers.map(word => capitalize(word)));
});
</script>

<template>
  <Dialog :isOpen="showDialog" @modal-close="closeDialog" name="alert-dialog">
    <template #body>
      <div class="alert-dialog-text-wrapper">
        <span class="sv-string-viewer sv-string-viewer--multiline alert-dialog--text">{{ dialogMessage }}</span>
      </div>
    </template>
  </Dialog>
  <SurveyComponent :model="survey" />
</template>

<style scoped>
.alert-dialog-text-wrapper {
  padding: calc(2 * var(--sjs-base-unit, var(--base-unit, 6px)));
  text-align: center;
}
.alert-dialog--text {
  color: var(--red);
  font-family: "Canva Sans", sans-serif;
  font-weight: 600;
}
</style>
