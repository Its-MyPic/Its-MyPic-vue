import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { debounce } from "@/utils/debounce";
import { normalizeText } from "@/utils/textNormalization";

export const useSearchStore = defineStore("search", () => {
  // Buffer狀態 - 直接接收用戶輸入
  const queryBuffer = ref(new URLSearchParams(window.location.search).get("q") || "");
  
  // 計算狀態 - 經過延遲後更新，用於實際查詢
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

  // 手動觸發更新函數
  const flush = () => {
    query.value = queryBuffer.value;
    updateQueryParam();
  };

  // 單向數據流: queryBuffer changes -> debounce -> update query -> update URL
  watch(
    queryBuffer, 
    debounce((newValue) => {
      query.value = newValue;
      updateQueryParam();
    }, 500)
  );

  return {
    queryBuffer, // 暴露給UI組件用於輸入
    query,      // 僅用於內部計算，不建議直接修改
    normalizedQuery,
    flush       // 手動觸發更新
  };
});
