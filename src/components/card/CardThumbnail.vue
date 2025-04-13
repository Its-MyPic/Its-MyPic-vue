<template>
  <div>
    <v-card class="card-size" color="surface-variant" rounded="lg" variant="tonal" @click="$emit('click')">
      <img :src="props.imageUrl" class="img-size" :alt="text" />
      <div class="timestamp-overlay">
        {{ episodeText }} {{ timestamp }}
      </div>
      <div class="card-text text-center justify-center">
        {{ text }}
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { generateEpisodeText } from '@/utils/urlUtils';
import { calculateTimestamp } from '@/utils/timeUtils';
import type { PropType } from 'vue';
import type { Card } from '@/types/card';

const props = defineProps({
  cardData: {
    type: Object as PropType<Card>,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
});

defineEmits<{
  (e: 'click'): void
}>();

const text = props.cardData.text;
const season = props.cardData.season;
const episode = props.cardData.episode;
const frameStart = props.cardData.frame.start;
const framePrefer = props.cardData.frame.prefer;

// Generate episode text (e.g., "MyGO 第1話")
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
  font-size: 1rem;
}

.card-text {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px;
}

.img-size {
  width: 100%;
  aspect-ratio: 16/9;
}

.card-size {
  aspect-ratio: 310/220;
}
</style>
