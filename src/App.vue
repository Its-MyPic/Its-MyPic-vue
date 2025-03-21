<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useDataStore, useFilterStore, useSearchStore } from "@/stores";

const dataStore = useDataStore();
const filterStore = useFilterStore();
const searchStore = useSearchStore();

onMounted(async () => {
  // Initialize stores from URL parameters
  filterStore.initFromUrl();
  searchStore.initFromUrl();
  
  // Fetch initial data
  await dataStore.fetchCards();
});
</script>
