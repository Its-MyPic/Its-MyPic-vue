import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
  const isReversed = ref(false);
  const copyMode = ref(false);
  const wayBackMode = ref(false);

  const toggleReverse = () => {
    isReversed.value = !isReversed.value;
  };
  const togglewayBackMode = () => {
    wayBackMode.value = !wayBackMode.value;
  };

  const toggleCopyMode = () => {
    copyMode.value = !copyMode.value;
  };

  return {
    isReversed,
    copyMode,
    wayBackMode,
    toggleReverse,
    toggleCopyMode,
    togglewayBackMode
  };
});
