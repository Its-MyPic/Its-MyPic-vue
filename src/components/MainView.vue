<template>
  <AppBarComponent @update:searchQuery="updateSearchQuery" />
  <!-- <v-container class="fill-height" fluid> -->
  <Grid :length="filteredCards.length" :pageSize="cardsPerRow" :pageProvider="pageProvider" :get-key="getKey" class="grid ma-5">
    <template v-slot:placeholder="{ index, style }">
      <div class="item" :style="style">載入中...</div>
    </template>
    <template v-slot:default="{ item, style, index }">
      <CardComponent :styles="style" :cardData="item" :preferCopyURL="copyMode" />
    </template>
  </Grid>
  <FooterComponent v-model:copy-url-mode="copyMode" />
</template>

<script setup lang="ts">
import AppBarComponent from "./AppBarComponent.vue";
import FooterComponent from "./FooterComponent.vue";
import CardComponent from "./CardComponent.vue";
import Grid from "vue-virtual-scroll-grid";
const copyMode = ref<boolean>(false);

const updateSearchQuery = (query: string) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  filterCards(query);
};

import { ref, onMounted, onUnmounted, computed } from "vue";

import cardsData from "../assets/data/data.json";
const filteredCards = ref(cardsData);

let cardsPerRow = ref(4);
const calcRows = () => {
  cardsPerRow.value = (1 + Math.floor((window.innerWidth - 320) / 310)) * 8;
  // console.log(cardsPerRow.value);
};

const pageProvider = computed(() => {
  const filtered = filteredCards.value;
  return (page: number, pageSize: number) => {
    // console.log(page, pageSize);
    const slice = filtered.slice(page * pageSize, (page + 1) * pageSize);
    return Promise.resolve(slice);
  };
});

const getKey = (item: any) => {
  // console.log(item.value?.segment_id);
  return item.value?.segment_id;
};

onMounted(() => {
  calcRows();
  window.addEventListener("resize", calcRows);
});

onUnmounted(() => {
  window.removeEventListener("resize", calcRows);
});

// @ts-ignore
import { ConverterFactory } from 'opencc-js/core'; // primary code
// @ts-ignore
import cn from 'opencc-js/from/cn'; // dictionary
// @ts-ignore
import tw from 'opencc-js/to/tw'; // dictionary

const converter = ConverterFactory(cn, tw);

const filterCards = (query: string) => {
  if (query === "") {
    filteredCards.value = cardsData;
  } else {
    const temp: string = converter(query.toLowerCase().replace("你", "妳"));
    filteredCards.value = cardsData.filter((card) =>
      card.text.toLowerCase().replace("你", "妳").includes(temp)
    );
  }
};
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
