import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
  const isReversed = ref(false);
  const copyMode = ref(false);

  const toggleReverse = () => {
    isReversed.value = !isReversed.value;
  };

  const toggleCopyMode = () => {
    copyMode.value = !copyMode.value;
  };

  return {
    isReversed,
    copyMode,
    toggleReverse,
    toggleCopyMode
  };
});
