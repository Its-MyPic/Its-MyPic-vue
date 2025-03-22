<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useDataStore } from "@/stores";

const dataStore = useDataStore();

onMounted(async () => {
  // Fetch initial data
  await dataStore.fetchCards();
});
</script>
