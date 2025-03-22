import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { debounce } from "@/utils/debounce";
import { normalizeText } from "@/utils/textNormalization";

export const useSearchStore = defineStore("search", () => {
  const query = ref(new URLSearchParams(window.location.search).get("q") || "");

  // Convert and normalize query text
  const normalizedQuery = computed(() => {
    if (!query.value) return "";
    return normalizeText(query.value);
  });

  // Sync with URL
  const updateQueryParam = () => {
    const url = new URL(window.location.href);
    if (query.value === "") {
      url.searchParams.delete("q");
    } else {
      url.searchParams.set("q", query.value);
    }
    window.history.pushState({}, "", url.toString());
  };

  // Watch for changes and update URL
  watch(
    query,
    debounce(() => updateQueryParam(), 300)
  );

  return {
    query,
    normalizedQuery
  };
});
