<template>
  <Suspense>
    <template #default>
      <Grid :length="cards.length ? cards.length : 1" :pageSize="cardsPerRow"
        :pageProvider="pageProvider" :get-key="getKey" class="grid ma-5">
        <!-- :page-provider-debounce-time="1000" -->
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { storeToRefs } from "pinia";
import settings from '@/assets/setting.json';

const resultsStore = useResultsStore();

const { filteredCards: cards } = storeToRefs(resultsStore);

const webhookUrl = computed(() =>
  `https://discord.com/api/webhooks/${atob(settings.webhook)}`
);

let cardsPerRow = ref(24);
const calcRows = () => {
  var width = Math.max(0, window.innerWidth - 290);
  var cnt = Math.floor((width) / 270) + 1;
  cardsPerRow.value = cnt * 8;
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
  grid-template-rows: 4;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  align-items: center;
  justify-content: center;
}
.card-size {
  aspect-ratio: 320/220;
}
</style>
