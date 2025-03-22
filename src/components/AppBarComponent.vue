<template>
  <v-app-bar density="prominent">
    <v-container>
      <div class="text-h5 mx-auto font-weight-bold text-center text-truncate">
        MyGO Mujica 截圖搜尋器
      </div>
      <v-row dense class="mt-2">
        <v-col class="text-center">
          <v-text-field v-model="localQuery" single-line hide-details clearable label="搜尋" variant="outlined"
            class="short-search" @keyup.enter="applySearch" @click:clear="clearMessage" autofocus>
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
import { ref, watch } from "vue";
import { mdiSortReverseVariant, mdiSortVariant } from "@mdi/js";
import { useUIStore, useSearchStore } from "@/stores";
import { debounce } from "@/utils/debounce";

const uiStore = useUIStore();
const searchStore = useSearchStore();

// 本地狀態
const localQuery = ref(searchStore.query);

// 延遲更新 store
const updateSearch = debounce((value: string) => {
  searchStore.query = value;
}, 500);

// 監聽本地值變化
watch(localQuery, (value) => {
  updateSearch(value);
});

// 立即應用搜索
const applySearch = () => {
  searchStore.query = localQuery.value;
};

// 清除搜索
const clearMessage = () => {
  localQuery.value = "";
  searchStore.query = "";
};
</script>
