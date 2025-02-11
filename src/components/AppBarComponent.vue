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
            @input="debounceEmitSearchQuery" autofocus >
            <template v-slot:append>
              <v-icon @click="ascendingBind = !ascendingBind"
                :icon="ascendingBind ? mdiSortVariant : mdiSortReverseVariant">
              </v-icon>
            </template>
            <template v-slot:append-inner>
              <v-icon :icon="mdiTune">
                <v-dialog>
                  <v-card>
                    <v-select label="角色篩選" class="" variant="outlined" multiple :items="characters"
                      style="height: 56px;">
                      <!-- <template v-slot:selection="{ item }">
                        <v-chip v-if="item.length < 3" v-text="item.length + ' 個角色'"></v-chip>
                        <v-chip v-else v-text="item.length + ' 個角色'"></v-chip>
                      </template> -->
                    </v-select>
                  </v-card>
                </v-dialog>
              </v-icon>
            </template>

          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { mdiSortReverseVariant, mdiSortVariant, mdiTune } from "@mdi/js";
const ascendingBind = computed({ get() { return ascending.value }, set(newValue) { ascending.value = newValue; } });
const ascending = defineModel('ascending', { type: Boolean, required: true });
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
