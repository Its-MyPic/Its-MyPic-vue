<template>
  <v-select
    v-model="selected"
    :label="label"
    variant="outlined"
    multiple
    :items="items"
    style="min-width:250px"
  >
    <template #prepend-item>
      <v-list-item
        title="全選"
        @click="toggleSelectAll"
      >
        <template #prepend>
          <v-checkbox-btn
            :indeterminate="indeterminate"
            :model-value="allSelected"
          />
        </template>
      </v-list-item>
      <v-divider class="mt-2" />
    </template>
    <template #selection="{ item, index }">
      <v-chip v-if="selected.length != items.length">
        <span>{{ item }}</span>
      </v-chip>

      <v-chip v-if="index === (items.length - 1)">
        <span>全選</span>
      </v-chip>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { computed, type PropType, watch } from 'vue';


const props = defineProps({
  items: {
    type: Array as PropType<(string | number)[]>,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: 'Select',
  },
});
const selected = defineModel({
  type: Array as PropType<(string | number)[]>,
  required: true,
});
const allSelected = computed(() => selected.value.length === props.items.length);
const indeterminate = computed(() => selected.value.length > 0 && selected.value.length < props.items.length);

const toggleSelectAll = () => {
  if (allSelected.value) {
    selected.value = [];
  } else {
    selected.value = [...props.items];
  }
};

watch(selected, () => {
  selected.value.sort();
});

</script>
