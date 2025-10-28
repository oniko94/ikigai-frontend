import { defineStore } from "pinia";

export const useStore = defineStore("game", {
  state: () => ({
    currentPhase: 0,
    collectedData: {},
    direction: "forward",
    phases: [
      { title: "Пошук Координат" },
      { title: "Фільтрація Координат" },
      { title: "Оцінювання Координат" }
    ]
  }),

  getters: {
    totalPhases: (state) => state.phases.length,
    currentTitle: (state) => state.phases[state.currentPhase].title
  },

  actions: {
    completePhase(data) {
      if (this.currentPhase < this.phases.length - 1) {
        this.direction = "forward";
        this.currentPhase++;
      } else {
        console.log(`Results: ${this.collectedData}`);
      }
    },

    goBack() {
      if (this.currentPhase > 0) {
        this.direction = "backward";
        this.currentPhase--;
      }
    },

    reset() {
      this.currentPhase = 0;
      this.collectedData = {};
      this.direction = "forward";
    }
  }
});
