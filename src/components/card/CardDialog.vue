<template>
  <v-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" max-width="600px" :style="{ maxHeight: '90vh' }">
    <v-card>
      <div style="position: relative;">
        <v-img :src="imageUrl" :style="{ maxHeight: '70vh', objectFit: 'contain' }" />
        <div class="timestamp-overlay">
          {{ episodeText }} {{ timestamp }}
        </div>
      </div>
      <v-row>
        <v-col>
          <v-card-text class="text-center">{{ text }}</v-card-text>
        </v-col>
      </v-row>
      <v-card-actions>
        <action-buttons 
          :card-data="cardData"
          :webhook-url="webhookUrl"
          :image-url="imageUrl"
          :is-gif-creating="isGifCreating"
          @gif-create="$emit('gif-create')"
        >
          <template #report-dialog>
            <slot name="report-dialog" />
          </template>
        </action-buttons>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { generateEpisodeText } from '@/utils/urlUtils';
import { calculateTimestamp } from '@/utils/timeUtils';
import type { PropType } from 'vue';
import type { Card } from '@/types/card';
import ActionButtons from './ActionButtons.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  cardData: {
    type: Object as PropType<Card>,
    required: true,
  },
  webhookUrl: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isGifCreating: {
    type: Boolean,
    default: false,
  }
});

defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'gif-create'): void;
}>();

const text = props.cardData.text;
const season = props.cardData.season;
const episode = props.cardData.episode;
const frameStart = props.cardData.frame.start;

// Generate episode text
const episodeText = computed(() =>
  generateEpisodeText(season, episode)
);

// Generate timestamp from frame number
const timestamp = computed(() =>
  calculateTimestamp(frameStart)
);
</script>

<style scoped>
.timestamp-overlay {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 5px;
}
</style>
