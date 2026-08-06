import { createPinia, setActivePinia } from "pinia";
import { computed, readonly, ref } from "vue";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { data } from "@/plugins/data";
import { infoToCard } from "@/types/card";
import { useDataStore } from "@/stores/modules/dataStore";
import { useSearchStore } from "@/stores/modules/searchStore";
import { useResultsStore } from "@/stores/modules/resultsStore";
import { normalizeText } from "@/utils/textNormalization";

const makeInfo = (text: string, overrides: Partial<data.IInfo> = {}) =>
  new data.Info({
    text,
    season: 1,
    episode: 1,
    segmentId: Math.floor(Math.random() * 1e6),
    ...overrides,
  });

describe("infoToCard", () => {
  it("建構時就預先計算 normalizedText", () => {
    const card = infoToCard(makeInfo("  多多ちゃん "));
    expect(card.normalizedText).toBeDefined();
    expect(card.normalizedText).toContain("多");
  });

  it("normalizedText 與搜尋用 normalizeText 一致", () => {
    const card = infoToCard(makeInfo("搜尋測試"));
    expect(card.normalizedText).toBe(normalizeText("搜尋測試"));
  });
});

describe("readonly 卡片搜尋（vue 3.5.25+ regression）", () => {
  it("卡片放入 readonly(ref) 後仍可用 normalizedText 過濾", () => {
    const cards = [
      infoToCard(makeInfo("多多 ちゃん")),
      infoToCard(makeInfo("Apple")),
      infoToCard(makeInfo("Banana")),
    ];
    const store = readonly(ref(cards));
    const query = ref("多");
    const normalizedQuery = computed(() => normalizeText(query.value));
    const filtered = computed(() =>
      store.value.filter(c => c.normalizedText?.includes(normalizedQuery.value)),
    );

    expect(filtered.value.map(c => c.text)).toEqual(["多多 ちゃん"]);

    query.value = "apple";
    expect(filtered.value.map(c => c.text)).toEqual(["Apple"]);

    query.value = "";
    expect(filtered.value).toHaveLength(3);
  });
});

describe("resultsStore 搜尋流程（integration）", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      location: { href: "http://localhost/" },
      history: { pushState() {} },
    });
    vi.stubGlobal("fetch", vi.fn(async () => ({
      arrayBuffer: async () =>
        readFileSync("public/data/data.bin").buffer as ArrayBuffer,
    })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("資料載入後搜尋過濾正確，清空後恢復全量", async () => {
    setActivePinia(createPinia());
    const dataStore = useDataStore();
    const searchStore = useSearchStore();
    const resultsStore = useResultsStore();

    await dataStore.fetchCards();
    expect(resultsStore.filteredCards.length).toBeGreaterThan(0);

    const query = normalizeText(dataStore.cards[0].text).slice(0, 1);
    searchStore.queryBuffer = query;
    searchStore.flush();
    expect(resultsStore.filteredCards.length).toBeGreaterThan(0);
    expect(resultsStore.filteredCards.every(c =>
      c.normalizedText?.includes(searchStore.normalizedQuery),
    )).toBe(true);

    searchStore.queryBuffer = "__no_such_query__";
    searchStore.flush();
    expect(resultsStore.filteredCards).toEqual([]);

    searchStore.queryBuffer = "";
    searchStore.flush();
    expect(resultsStore.filteredCards.length).toBe(dataStore.cards.length);
  });

  it("資料重新載入（換新陣列）後快取被清空，不會回傳舊結果", async () => {
    setActivePinia(createPinia());
    const dataStore = useDataStore();
    const searchStore = useSearchStore();
    const resultsStore = useResultsStore();

    await dataStore.fetchCards();
    const first = dataStore.cards[0].text;
    searchStore.queryBuffer = normalizeText(first).slice(0, 1);
    searchStore.flush();
    const before = resultsStore.filteredCards.length;
    expect(before).toBeGreaterThan(0);

    await dataStore.fetchCards();
    await new Promise(r => setTimeout(r, 0));
    expect(resultsStore.filteredCards.length).toBe(before);
  });
});
