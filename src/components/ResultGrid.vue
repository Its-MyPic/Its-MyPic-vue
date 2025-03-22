<template>
  <Suspense>
    <template #default>
      <Grid :length="cards.length ? cards.length : 1" :pageSize="cardsPerRow"
        :pageProvider="pageProvider" :get-key="getKey" :page-provider-debounce-time="100" class="grid ma-5">
        <template v-slot:placeholder="{ index, style }">
          <div class="item" :style="style">{{ cards.length ? "還在GO..." : "" }}</div>
        </template>
        <template v-slot:default="{ item, style, index }">
          <CardComponent 
            :styles="style" 
            :card-data="item" 
            :video-config="settings.videoLink"
            :webhook-url="webhookUrl"
          />
        </template>
      </Grid>
    </template>

    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import CardComponent from "./card/index.vue";
import Grid from "vue-virtual-scroll-grid";
import { useResultsStore, useUIStore } from '@/stores';
import { ref, onMounted, onUnmounted, computed } from "vue";
import { storeToRefs } from "pinia";
import type { Card } from '@/types/card';
import settings from '@/assets/setting.json';

const resultsStore = useResultsStore();
const uiStore = useUIStore();

const { filteredCards: cards } = storeToRefs(resultsStore);

const webhookUrl = computed(() => 
  `https://discord.com/api/webhooks/${atob(settings.webhook)}`
);

let cardsPerRow = ref(24);
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
  return (page: number, pageSize: number) => {
    const slice = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return Promise.resolve(slice);
  };
});

const getKey = (item: any) => item.value?.segmentId;

onMounted(() => {
  calcRows();
  window.addEventListener("resize", calcRows);
});

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
