<template>
  <v-dialog v-model="enable" max-width="600px" style="min-height: 600px;" transition="dialog-top-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-icon v-bind="activatorProps" :icon="mdiTune">
      </v-icon>
    </template>
    <v-card class="d-flex flex-column align-center justify-center font-weight-bold">
      <br />
      <br />
      <span class="align-center">集數篩選</span>
      <MultiSelect :items="EPISODES[Season.MYGO]" v-model="mygoFilter" label="MyGO"
        style="min-width:250px" />
      <MultiSelect :items="EPISODES[Season.AVE_MUJICA]" v-model="aveMujicaFilter" label="Ave Mujica"
        style="min-width:250px" />

      <!-- <span class="align-center">角色篩選</span>
      <MultiSelect :items="characters" v-model="characterFilter" label="角色篩選" style="min-width:250px" />

      <v-checkbox class="text-center" label="角色嚴格篩選" /> -->
      <v-card-actions>
        <v-btn class="text-center" text="清除篩選" @click="cleanFilter" />
        <v-btn class="text-center" text="確定" @click="applyFilter" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MultiSelect from "./MultiSelect.vue";
import { useFilterStore } from "@/stores";
import { mdiTune } from "@mdi/js";
import { EPISODES, Season } from "@/constants/filters";

const filterStore = useFilterStore();

const characters = ['高松燈', '千早愛音', '要樂奈', '長崎爽世', '椎名立希', '三角初華', '豐川祥子', '八幡海鈴', '祐天寺若麥', '若葉睦'];
const enable = ref(false);

const characterFilter = ref<string[]>([]);
const mygoFilter = ref<number[]>([]);
const aveMujicaFilter = ref<number[]>([]);

const cleanFilter = () => {
  mygoFilter.value = [];
  aveMujicaFilter.value = [];
  characterFilter.value = [];
};

const applyFilter = () => {
  filterStore.mygoEpisodes = mygoFilter.value;
  filterStore.avemujicaEpisodes = aveMujicaFilter.value;
  filterStore.characterId = 0;
  enable.value = false;
};

onMounted(() => {
  // Initialize from filterStore
  mygoFilter.value = filterStore.mygoEpisodes;
  aveMujicaFilter.value = filterStore.avemujicaEpisodes;
});
</script>
