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
              <v-icon @click="uiStore.toggleReverse"
                :icon="uiStore.isReversed ? mdiSortVariant : mdiSortReverseVariant">
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
import { onMounted, ref } from "vue";
import { mdiSortReverseVariant, mdiSortVariant } from "@mdi/js";
import { useUIStore, useSearchStore } from "@/stores";
import { debounce } from "@/utils/debounce";

const uiStore = useUIStore();
const searchStore = useSearchStore();

const searchQuery = ref("");

const debounceEmitSearchQuery = debounce(() => {
  searchStore.query = searchQuery.value;
}, 500);

const emitSearchQuery = () => {
  searchStore.query = searchQuery.value;
};

const clearMessage = () => {
  searchQuery.value = "";
  searchStore.query = "";
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  if (q) {
    searchQuery.value = q;
    searchStore.query = q;
  }
});
</script>
