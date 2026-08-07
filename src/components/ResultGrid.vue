<template>
  <Suspense>
    <template #default>
      <Grid
        :length="cards.length ? cards.length : 1"
        :page-size="PAGE_SIZE"
        :page-provider="pageProvider"
        :get-key="getKey"
        class="grid ma-5"
      >
        <template #probe>
          <div class="card-size">
            Probe
          </div>
        </template>
        <template #placeholder="{ style }">
          <div
            class="card-size"
            :style="style"
          >
            {{ cards.length ? "還在GO..." : "" }}
          </div>
        </template>
        <template #default="{ item, style }">
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
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import settings from '@/assets/setting.json';

const resultsStore = useResultsStore();

const { filteredCards: cards } = storeToRefs(resultsStore);

const webhookUrl = computed(() =>
  `https://discord.com/api/webhooks/${atob(settings.webhook)}`
);

const PAGE_SIZE = 60;

const pageProvider = computed(() => {
  const filtered = cards.value;
  return (page: number, pageSize: number) => {
    const slice = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return Promise.resolve(slice);
  };
});

const getKey = (item: { index?: number; value?: unknown }) => {
  const card = item.value as { segmentId?: number } | undefined;
  return card?.segmentId ?? `p-${item.index ?? 0}`;
};

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
