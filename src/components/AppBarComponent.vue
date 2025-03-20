<template>
  <v-app-bar density="prominent">
    <v-container>
      <div class="text-h5 mx-auto font-weight-bold text-center text-truncate">
        MyGO Mujica 截圖搜尋器
      </div>
      <v-row dense class="mt-2">
        <v-col class="text-center">
          <v-text-field v-model="searchQuery" single-line hide-details clearable label="搜尋" variant="outlined"
            class="short-search" @keyup.enter="emitSearchQuery" @click:clear="clearMessage"
            @input="debounceEmitSearchQuery" autofocus>
            <template v-slot:append>
              <v-icon @click="reverse.reverse = !reverse.reverse"
                :icon="reverse.reverse ? mdiSortVariant : mdiSortReverseVariant">
              </v-icon>
            </template>
            <template v-slot:append-inner>
              <FilterDialog />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { mdiSortReverseVariant, mdiSortVariant } from "@mdi/js";
import { useReverse, useQuery } from "@/stores/states";

const reverse = useReverse();
const query = useQuery();

const debounceTimeout = ref<number>();

const searchQuery = ref("");

const debounceEmitSearchQuery = () => {
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(emitSearchQuery, 500);
};

const emitSearchQuery = () => {
  clearTimeout(debounceTimeout.value);
  query.query = searchQuery.value;
};

const clearMessage = () => {
  searchQuery.value = "";
  query.query = "";
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  if (q) {
    searchQuery.value = q;
    query.query = q;
  }
});
</script>
