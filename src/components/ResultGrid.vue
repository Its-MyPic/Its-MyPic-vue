<template>
  <Suspense>
    <template #default>
      <Grid :length="cards.length ? cards.length : 1" :pageSize="cardsPerRow"
        :page-provider="pageProvider" :get-key="getKey" class="grid ma-5">
        <template v-slot:probe>
          <div class="card-size">Probe</div>
        </template>
        <template v-slot:placeholder="{ index, style }">
          <div class="card-size" :style="style">{{ cards.length ? "還在GO..." : "" }}</div>
        </template>
        <template v-slot:default="{ item, style, index }">
          <CardComponent
            :styles="style"
            :card-data="item"
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
import { useResultsStore } from '@/stores';
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import settings from '@/assets/setting.json';

const resultsStore = useResultsStore();

const { filteredCards: cards } = storeToRefs(resultsStore);

const webhookUrl = computed(() =>
  `https://discord.com/api/webhooks/${atob(settings.webhook)}`
);

const cardsPerRow = computed(() => cards.value.length || 1);

const pageProvider = computed(() => {
  const filtered = cards.value;
  return (page: number, pageSize: number) => {
    const slice = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return Promise.resolve(slice);
  };
});

const getKey = (item: any) => item.value?.segmentId;

watch(cards, () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  align-items: center;
  justify-content: center;
}
.card-size {
  aspect-ratio: 320/220;
}
</style>
