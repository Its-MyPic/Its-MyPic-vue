<template>
  <v-app-bar density="prominent">
    <v-container>
      <div class="text-h5 mx-auto font-weight-bold text-center text-truncate">
        MyGO Mujica 截圖搜尋器
      </div>
      <v-row dense class="mt-2">
        <v-col class="text-center" cols="6">
          <v-select label="角色篩選" chips variant="outlined" multiple :items="characters"></v-select>
        </v-col>
        <v-col class="text-center" cols="6">
          <v-text-field v-model="searchQuery" single-line hide-details clearable label="搜尋" variant="outlined"
            class="short-search" @keyup.enter="emitSearchQuery" @click:clear="clearMessage" @input="debounceEmitSearchQuery"
            :append-inner-icon="mdiTune"
            autofocus/>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { mdiTune } from "@mdi/js";
const emit = defineEmits(['update:searchQuery']);
const searchQuery = ref("");
const debounceTimeout = ref<number>();
const characters = ['高松燈', '千早愛音', '要樂奈', '長崎爽世', '椎名立希', '三角初華', '豐川祥子', '八幡海鈴', '祐天寺若麥', '若葉睦'];


const debounceEmitSearchQuery = () => {
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => emit('update:searchQuery', searchQuery.value), 500);
};

const emitSearchQuery = () => {
  clearTimeout(debounceTimeout.value);
  emit('update:searchQuery', searchQuery.value);
};

const clearMessage = () => {
  searchQuery.value = "";
  emit('update:searchQuery', searchQuery.value);
};
</script>
