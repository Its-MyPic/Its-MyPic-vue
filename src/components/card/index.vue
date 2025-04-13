<template>
  <div :style="styles">
    <card-thumbnail :card-data="cardData" :image-url="imageUrl" @click="showDialog = true" />

    <card-dialog v-model:show="showDialog" :card-data="cardData" :webhook-url="webhookUrl" :image-url="imageUrl"
      @gif-create="handleGifCreate" :is-gif-creating="gifDialogRef?.isGeneratingGif">
      <template #report-dialog>
        <report-dialog :file-name="imageUrl" :text="cardData.text" />
      </template>
    </card-dialog>

    <gif-dialog ref="gifDialogRef" :text="cardData.text" :season="cardData.season" :episode="cardData.episode"
      :frame-start="cardData.frame.start" :frame-end="cardData.frame.end" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { generateImageUrl } from '@/utils/urlUtils';
import type { PropType } from 'vue';
import type { Card } from '@/types/card';
import CardThumbnail from './CardThumbnail.vue';
import CardDialog from './CardDialog.vue';
import ReportDialog from '../ReportDialog.vue';
import GifDialog from '../GifDialog.vue';
import { useUIStore } from '@/stores';

const props = defineProps({
  styles: {
    type: Object as PropType<Record<string, string>>,
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
  baseImageUrl: {
    type: String,
    default: 'https://mypic.0m0.uk/images/'
  }
});

const uiStore = useUIStore();
const showDialog = ref(false);
const gifDialogRef = ref<InstanceType<typeof GifDialog> | null>(null);
const imageUrl = computed(() => generateImageUrl(
  props.baseImageUrl,
  props.cardData.season,
  props.cardData.episode,
  props.cardData.frame.prefer,
  uiStore.wayBackMode,
));

const handleGifCreate = async () => {
  if (!gifDialogRef.value) return;
  await gifDialogRef.value.CreateGif();
};
</script>
