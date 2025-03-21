<template>
  <div class="thumbnail-container">
    <v-card class="card size" color="surface-variant" rounded="lg" variant="tonal" @click="$emit('click')">
      <div class="image-container size">
        <img :src="imgUrl" class="size" :alt="text" />
        <div class="timestamp-overlay">
          {{ episodeText }} {{ timestamp }}
        </div>
      </div>
      <v-card-text class="card-text text-center justify-center">
        {{ text }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { generateImageUrl, generateEpisodeText } from '@/utils/urlUtils';
import { calculateTimestamp } from '@/utils/timeUtils';
import type { PropType } from 'vue';
import type { Card } from '@/types/card';

const props = defineProps({
  cardData: {
    type: Object as PropType<Card>,
    required: true,
  },
  baseImageUrl: {
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

// Generate image URL
const imgUrl = computed(() => 
  generateImageUrl(props.baseImageUrl, season, episode, framePrefer)
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

.card-text {
  display: flex;
  flex-direction: column;
  height: 80px;
  max-width: 280px;
  flex: 1;
}

.size {
  width: 280px;
  height: 157px;
}

.card {
  left: 50%;
  transform: translate(-50%, 0);
  height: 237px;
}
</style>
