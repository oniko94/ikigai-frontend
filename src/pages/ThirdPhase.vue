<script>
const getSectorPage = (pageName) => {
  return [
    Number(pageName.split("_")[1]) + 1,
    Number(pageName.split("_")[3]) + 1,
  ];
};

const processResult = (professions, sectors) => {
  // Merge all user answers to a simple map of profession and its final total score
  const summary = professions.reduce((acc, prof) => {
    acc[prof] = Object.values(sectors).reduce((sum, obj) => {
      return sum + (obj[prof] ?? 0);
    }, 0);
    return acc;
  }, {});
  // Use this object to generate row objects for the result table after completing the survey
  return Object.entries(summary).map(([skill, score]) => {
    return {
      skill,
      ikigai: score === 24 ? score : "",
      tools: (score >= 16 && score <= 23) ? score : "",
      holes: score <= 15 ? score : ""      
    };
  });
};

const TABLE_HEADERS = [
  "Навички",
  "Ікігай (24)",
  "Інструменти (>= 16, <= 23)",
  "Діри (<= 15)"
];
</script>

<script setup>
import { ref } from "vue";
import { Model, Serializer } from "survey-core";
import { SurveyComponent } from "survey-vue3-ui";
import { surveyLocalization } from "survey-core";
import * as animations from "../animations";
import { buildTableHtml, getProgress } from "../utils";

import sectors from "../assets/phase3.json";
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
const sectorPageCount = props.phaseData.data.length;

Serializer.addProperties("survey", [{
  name: "sectorProgressValue",
  type: "number",
  category: "general",
  default: getProgress(1, sectorPageCount),
  readOnly: false,
  onSetValue(survey, value) {
    survey.setPropertyValue("sectorProgressValue", value);
  }
}, {
  name: "sectorCurrentPageNo",
  type: "string",
  category: "general",
  default: `1 / ${sectorPageCount}`,
  readOnly: false,
  onSetValue(survey, value) {
    survey.setPropertyValue("sectorCurrentPageNo", value);
  }
}, {
  name: "currentSector",
  type: "string",
  category: "general",
  default: `1 / ${sectors.length}`,
  readOnly: false,
  onSetValue(survey, value) {
    survey.setPropertyValue("currentSector", value);
  }
}])

const survey = ref({});
const pages = ref([]);
const doAnimation = ref(true);

sectors.forEach((sector, index) => {
  props.phaseData.data.forEach((prof, i) => {
    pages.value.push({
      name: `sector_${index}_page_${i}`,
      elements: [{
        type: "matrix",
        name: `sector_${index}_question_${i}`,
        title: sector.question,
        columns: [{
          value: 3,
          text: "Так"
        }, {
          value: 1,
          text: "Можливо"
        }, {
          value: 0,
          text: "Ні"
        }],
        rows: [{
          value: prof,
          text: prof
        }],
        transposeData: false,
        alternateRows: true,
        eachRowRequired: true
      }]
    });
  });
});

survey.value = new Model({
  title: props.phaseTitle,
  progressBarType: "questions",
  sectorProgressValue: getProgress(1, sectorPageCount),
  sectorCurrentPageNo: `1 / ${sectorPageCount}`,
  currentSector: `1 / ${sectors.length}`,
  pages: pages.value
});
survey.value.applyTheme(theme);
survey.value.addLayoutElement({
  id: "progressbar",
  component: "progress-bar",
  container: "header",
  data: survey.value
});

/* Animations */
survey.value.onAfterRenderSurvey.add(() => {
  if (!doAnimation.value) return;

  animations.showBody();
});

survey.value.onCurrentPageChanging.add((sender, options) => {
  if (!doAnimation.value) return;

  options.allow = false;
  animations.hidePage();

  setTimeout(() => {
    doAnimation.value = false;
    const [sector, page] = getSectorPage(options.newCurrentPage.name);
    sender.currentPage = options.newCurrentPage;

    if (sector !== sender.currentSector) {
      sender.currentSector = `${sector} / ${sectors.length}`;
    }

    sender.sectorProgressValue = getProgress(page, sectorPageCount);
    sender.sectorCurrentPageNo = `${page} / ${sectorPageCount}`;
    animations.showPage();
    doAnimation.value = true;
  }, 400);
});

survey.value.onCompleting.add((sender, options) => {
  if (!doAnimation.value) return;
  options.allowComplete = false;

  animations.showLoader(); 
  animations.hideBody();
 
  const sectors = sender.data;
  const professions = props.phaseData.data;
  const tableData = processResult(professions, sectors);

  sender.title = "Система Координат (Підсумкова Таблиця)"
  sender.completedHtml = buildTableHtml(TABLE_HEADERS, tableData);

  setTimeout(() => {
    doAnimation.value = false;
    animations.hideLoader();
    animations.showBody();
    doAnimation.value = true;
  }, 1500);
  options.allowComplete = true;
});
</script>

<template>
  <SurveyComponent :model="survey" />
</template>
