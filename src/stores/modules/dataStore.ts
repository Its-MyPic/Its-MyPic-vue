import { defineStore } from "pinia";
import { ref, readonly } from "vue";
import type { Card } from "@/types/card";
import { infoToCard } from "@/types/card";
import { data } from "@/plugins/data";

export const useDataStore = defineStore("data", () => {
  const cards = ref<Card[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const fetchCards = async () => {
    if (cards.value.length > 0) return;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch("/data/data.bin");
      const buf = await response.arrayBuffer();
      const decoded = data.Data.decode(new Uint8Array(buf));
      // 直接將 IInfo 轉換為 Card
      cards.value = decoded.info.map(info => infoToCard(info));
    } catch (e) {
      error.value = e instanceof Error ? e : new Error("Failed to fetch cards");
      cards.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Public readonly state
  return {
    cards: readonly(cards),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchCards
  };
});
