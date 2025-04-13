<template>
  <v-app-bar density="prominent">
    <v-container>
      <div class="text-h5 mx-auto font-weight-bold text-center text-truncate">
        MyGO Mujica 截圖搜尋器
      </div>
      <v-row dense class="mt-2">
        <v-col class="text-center">
          <v-text-field v-model="searchStore.queryBuffer" single-line hide-details clearable label="搜尋" variant="outlined"
            class="short-search" @keyup.enter="applySearch" @click:clear="clearMessage" autofocus>
            <template v-slot:append>
              <v-icon @click="uiStore.toggleReverse"
                :icon="uiStore.isReversed ? mdiSortVariant : mdiSortReverseVariant">
              </v-icon>
              <v-btn text="時空機" @click="uiStore.togglewayBackMode"/>
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
import { mdiSortReverseVariant, mdiSortVariant } from "@mdi/js";
import { useUIStore, useSearchStore } from "@/stores";

const uiStore = useUIStore();
const searchStore = useSearchStore();

// 立即應用搜索（使用手動flush立即觸發更新）
const applySearch = () => {
  searchStore.flush(); // 手動觸發查詢更新，不等待debounce
};

// 清除搜索（使用手動flush立即觸發更新）
const clearMessage = () => {
  searchStore.queryBuffer = "";
  searchStore.flush(); // 手動觸發查詢更新，不等待debounce
};
</script>
