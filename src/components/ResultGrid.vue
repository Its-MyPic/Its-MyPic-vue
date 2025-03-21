<template>
  <Suspense>
    <template #default>
      <Grid :length="cards.length ? cards.length : 1" :pageSize="cardsPerRow"
        :pageProvider="pageProvider" :get-key="getKey" :page-provider-debounce-time="100" class="grid ma-5">
        <template v-slot:placeholder="{ index, style }">
          <div class="item" :style="style">{{ cards.length ? "還在GO..." : "" }}</div>
        </template>
        <template v-slot:default="{ item, style, index }">
          <CardComponent :styles="style" :cardData="item" />
        </template>
      </Grid>
    </template>

    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import CardComponent from "./CardComponent.vue";
import Grid from "vue-virtual-scroll-grid";
import { useDataStore, useResultsStore, useUIStore } from '@/stores';
import { ref, onMounted, onUnmounted, computed } from "vue";
import { storeToRefs } from "pinia";

const resultsStore = useResultsStore();
const uiStore = useUIStore();

// No need for dataStore since we fetch in App.vue
const { filteredCards: cards } = storeToRefs(resultsStore);

// Initialize data at component level if needed
onMounted(async () => {
  // No need to call fetchData here since it's handled in App.vue
  calcRows();
  window.addEventListener("resize", calcRows);
});

let cardsPerRow = ref(4);
const calcRows = () => {
  cardsPerRow.value = (1 + Math.floor((window.innerWidth - 320) / 310)) * 8;
};

const pageProvider = computed(() => {
  if (typeof window != "undefined") {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
  const filtered = cards.value;
  // Using isReversed from uiStore
  const update = uiStore.isReversed;
  return (page: number, pageSize: number) => {
    const slice = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return Promise.resolve(slice);
  };
});

const getKey = (item: any) => {
  return item.value?.segmentId;
};


onUnmounted(() => {
  window.removeEventListener("resize", calcRows);
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-gap: 20px;
  grid-template-rows: 237px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  align-items: center;
  justify-content: center;
}
</style>
