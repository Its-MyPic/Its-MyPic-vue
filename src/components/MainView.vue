<template>
  <AppBarComponent @update:searchQuery="updateSearchQuery" />

  <v-container class="fill-height" fluid>
    <v-responsive class="align-start fill-height mx-auto">
      <v-row class="text-center justify-center">
        <v-col v-for="(card, index) in showedCards" :key="card.segment_id" cols="auto">
          <CardComponent :frame_start="card.frame_start" :episode="card.episode" :text="card.text" :preferCopyURL="copyMode" />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>

  <FooterComponent v-model:copy-url-mode="copyMode"/>
</template>

<script setup lang="ts">
import AppBarComponent from "./AppBarComponent.vue";
import FooterComponent from "./FooterComponent.vue";
import CardComponent from "./CardComponent.vue";
const copyMode = ref<boolean>(false);

type CardData = {
  segment_id: number;
  frame_start: number;
  frame_end: number;
  episode: string;
  text: string;
};

const updateSearchQuery = (query: string) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  filterCards(query);
};

import { ref, onMounted, onUnmounted } from "vue";

import cardsData from "../assets/data/data.json";
const filteredCards = ref(cardsData);

const calcLoadChunkSize = () => {
  const PreferChunkSize = 20;
  const cardsPerRow = Math.floor((window.innerWidth - 8) / 304);
  const rowsToLoad = Math.max(4, Math.floor(PreferChunkSize / cardsPerRow));
  // console.log(cardsPerRow, rowsToLoad);
  return cardsPerRow * rowsToLoad;
};
let currentIndex = 24;

const showedCards = ref<CardData[]>([...filteredCards.value.slice(0, currentIndex)]);

const loadNextChunk = () => {
  let count = calcLoadChunkSize();
  // console.log(count);
  const end = currentIndex + count;
  showedCards.value.push(...filteredCards.value.slice(currentIndex, end));
  currentIndex = end;
};

const handleScroll = () => {
  if (1.3 * window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    loadNextChunk();
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
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
  currentIndex = 0;
  showedCards.value = [];
  loadNextChunk();
};
</script>
