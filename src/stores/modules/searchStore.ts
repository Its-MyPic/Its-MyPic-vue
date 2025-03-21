import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { debounce } from "@/utils/debounce";
import { normalizeText } from "@/utils/textNormalization";
// @ts-ignore
import { ConverterFactory } from "opencc-js/core";
// @ts-ignore
import cn from "opencc-js/from/cn";
// @ts-ignore
import tw from "opencc-js/to/tw";

const converter = ConverterFactory(cn, tw);

export const useSearchStore = defineStore("search", () => {
  const query = ref("");

  // Convert and normalize query text
  const normalizedQuery = computed(() => {
    if (!query.value) return "";
    return normalizeText(converter(query.value));
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

  // Initialize from URL
  const initFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      query.value = q;
    }
  };

  // Watch for changes and update URL
  watch(
    query,
    debounce(() => updateQueryParam(), 300)
  );

  return {
    query,
    normalizedQuery,
    initFromUrl
  };
});
