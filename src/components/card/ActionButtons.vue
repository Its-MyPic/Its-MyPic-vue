<template>
  <v-row>
    <v-btn @click="$emit('report')">
      回報
      <slot name="report-dialog" />
    </v-btn>
    <v-btn @click="handleDownload" :loading="imageOps.isDownloading.value">下載</v-btn>
    <v-btn @click="handleGifCreate" :loading="isGifCreating">GIF</v-btn>
    <v-btn v-long-press="handleLongPress" @click="handleClick" :loading="imageOps.isCopying.value">複製</v-btn>
    <v-btn :href="videoUrl" target="_blank">
      從這裡開始看
    </v-btn>
  </v-row>

  <v-snackbar v-model="showSnackbar" :timeout="2000" class="text-center" rounded="pill">
    <div class="text-h6 mx-auto font-weight-bold text-center text-truncate">
      {{ imageOps.operationStatus }}
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { useImageOperations } from '@/composables/useImageOperations';
import { useUIStore } from '@/stores';
import { generateVideoUrl } from '@/utils/urlUtils';
import { calculateVideoTimestamp } from '@/utils/timeUtils';
import { MYGO_FRAME_OFFSETS, Season } from '@/constants/filters';
import type { PropType } from 'vue';
import type { VideoLinkConfig } from '@/constants/filters';
import type { Card } from '@/types/card';

const props = defineProps({
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
  videoConfig: {
    type: Object as PropType<VideoLinkConfig>,
    required: true,
  },
  isGifCreating: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits<{
  (e: 'report'): void;
  (e: 'gif-create'): void;
}>();

const uiStore = useUIStore();
const wasLongPressed = ref(false);
const imageOps = useImageOperations({ webhookUrl: props.webhookUrl });
const showSnackbar = ref(false);

// Watch for operation status changes to show snackbar
watch(() => imageOps.operationStatus.value, (newStatus: string) => {
  if (newStatus) {
    showSnackbar.value = true;
  }
});

// Calculate video URL with timestamp
const videoUrl = computed(() => {
  const timestamp = calculateVideoTimestamp(
    props.cardData.frame.start,
    MYGO_FRAME_OFFSETS,
    props.cardData.episode,
    props.cardData.season === Season.MYGO
  );

  return generateVideoUrl(
    props.videoConfig,
    props.cardData.season,
    props.cardData.episode,
    timestamp
  );
});

const handleDownload = () => {
  imageOps.downloadImage(props.imageUrl, props.cardData.text);
};

const handleClick = async () => {
  if (wasLongPressed.value) {
    wasLongPressed.value = false;
    return;
  }
  try {
    if (uiStore.copyMode) {
      await imageOps.copyUrl(props.imageUrl);
    } else {
      await imageOps.copyImage(props.imageUrl);
    }
  } catch (error) {
    // Error is already handled in imageOps
  }
};

const handleLongPress = async () => {
  try {
    wasLongPressed.value = true;
    await imageOps.copyUrl(props.imageUrl);
  } catch (error) {
    // Error is already handled in imageOps
  }
};

const handleGifCreate = async () => {
  emit('gif-create');
};

// Reset flag when component unmounts
onUnmounted(() => {
  wasLongPressed.value = false;
});
</script>
