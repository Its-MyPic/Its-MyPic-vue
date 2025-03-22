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

  // URL sync with state comparison
  const updateQueryParam = () => {
    const url = new URL(window.location.href);
    
    // 檢查是否有實際變化
    const currentQ = url.searchParams.get("q");
    const newQ = query.value === "" ? null : query.value;
    
    if (currentQ === newQ) {
      console.debug('Query params unchanged, skip updating URL');
      return false; // 無變化，不更新URL
    }

    // 更新URL參數
    if (query.value === "") {
      url.searchParams.delete("q");
    } else {
      url.searchParams.set("q", query.value);
    }

    window.history.pushState({}, "", url.toString());
    return true; // 有變化，已更新URL
  };

  // 手動觸發更新函數
  const flush = () => {
    // 檢查是否有實際變化
    if (queryBuffer.value === query.value) {
      console.debug('Query unchanged, skip updating');
      return false; // 返回false表示沒有變化
    }
    
    // 更新計算狀態
    query.value = queryBuffer.value;
    
    // 更新URL
    updateQueryParam();
    return true; // 返回true表示有變化
  };

  // 單向數據流: queryBuffer changes -> debounce -> update query -> update URL
  watch(
    queryBuffer, 
    debounce((newValue) => {
      // 檢查是否有實際變化
      if (newValue === query.value) {
        console.debug('Query unchanged, skip updating');
        return;
      }
      
      // 更新計算狀態
      query.value = newValue;
      
      // 更新URL
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
