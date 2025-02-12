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
              <v-icon @click="ascendingBind = !ascendingBind"
                :icon="ascendingBind ? mdiSortVariant : mdiSortReverseVariant">
              </v-icon>
            </template>
            <template v-slot:append-inner>
              <v-dialog style="min-height: 600px;">
                <v-card class="d-flex flex-column align-center justify-center font-weight-bold">
                  <br />
                  <v-btn class="text-center" @click="">
                    清除篩選
                  </v-btn>
                  <!-- <span class="d-flex align-center">MyGO</span> -->

                  <span class="align-center">MyGO</span>
                  <v-select class="ma-5" label="角色篩選" chips variant="outlined" multiple :items="[1, 2, 3, 4, 5]"
                    style="min-width:50%">
                  </v-select>
                  <!-- <v-row class="text-center justify-center">
                    <v-col cols="auto" v-for="i in 13">
                      <v-chip>
                        {{ i }}
                      </v-chip>
                    </v-col>
                  </v-row> -->

                  <br />
                  <span class="align-center">Ave Mujica</span>
                  <v-select v-model="select" class="ma-5" label="角色篩選" variant="outlined" multiple
                    :items="Array.from({ length: 13 }, (_, n) => n + 1)" style="min-width:50%">

                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index < 2">
                        <span>{{ item.title }}</span>
                      </v-chip>
                      <span v-if="index === 2" class="text-grey text-caption align-self-center">
                        (+{{ select.length - 2 }} others)
                      </span>
                    </template>

                  </v-select>

                  <br />
                  <span class="align-center">角色篩選</span>
                  <v-select class="ma-5" label="角色篩選" chips variant="outlined" multiple :items="characters"
                    style="min-width:50%">
                  </v-select>
                </v-card>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-icon v-bind="activatorProps" :icon="mdiTune">
                  </v-icon>
                </template>
              </v-dialog>
            </template>

          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { mdiSortReverseVariant, mdiSortVariant, mdiTune } from "@mdi/js";
const ascendingBind = computed({ get() { return ascending.value }, set(newValue) { ascending.value = newValue; } });
const ascending = defineModel('ascending', { type: Boolean, required: true });
const emit = defineEmits(['update:searchQuery']);
const searchQuery = ref("");
const debounceTimeout = ref<number>();
const characters = ['高松燈', '千早愛音', '要樂奈', '長崎爽世', '椎名立希', '三角初華', '豐川祥子', '八幡海鈴', '祐天寺若麥', '若葉睦'];
const select = ref([]);

watch(() => select.value, (newValue) => {
  console.log(newValue);
});

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
