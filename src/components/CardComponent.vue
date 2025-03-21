<template>
  <div :style="styles">
    <v-card class="card size" color="surface-variant" rounded="lg" variant="tonal" @click="showDialog = true">
      <div style="position: relative;" class="size">
        <img :src="imgUrl" class="size" :alt="text" />
        <div
          style="position: absolute; top: 0; right: 0; background: rgba(0, 0, 0, 0.5); color: white; padding: 5px 5px;">
          {{ episodeText }} {{ timestamp }}
        </div>
      </div>
      <v-card-text class="card-text text-center justify-center">
        {{ text }}
      </v-card-text>
    </v-card>

    <v-dialog v-model="showDialog" max-width="600px" :style="{ maxHeight: '90vh' }">
      <v-card>
        <div style="position: relative;">
          <v-img :src="imgUrl" :style="{ maxHeight: '70vh', objectFit: 'contain' }" />
          <div
            style="position: absolute; top: 0; right: 0; background: rgba(0, 0, 0, 0.5); color: white; padding: 5px 5px;">
            {{ episodeText }} {{ timestamp }}
          </div>
        </div>
        <v-row>
          <v-col>
            <v-card-text class="text-center">{{ text }}</v-card-text>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row>
            <v-btn>
              回報
              <ReportDialog :fileName="imgUrl" :text="text" />
            </v-btn>
            <v-btn @click="downloadImage" :loading="isDownloading">下載</v-btn>
            <v-btn @click="async () => {
              if (!gifDialogRef) return;
              isGifCreating = true;
              try {
                await gifDialogRef.CreateGif();
              } finally {
                isGifCreating = false;
              }
            }" :loading="isGifCreating">GIF</v-btn>
            <v-btn v-long-press="() => copy(true)" @click="() => copy(false)" :loading="isCopying">複製</v-btn>
            <v-btn :href="videoLinkWithTimestamp" target="_blank">
              從這裡開始看
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <GifDialog ref="gifDialogRef" :text="text" :season="season" :episode="episode" :frame-start="frame_start"
      :frame-end="props.cardData.frameEnd" />

    <v-snackbar v-model="copyResult" :timeout=2000 class="text-center" rounded="pill">
      <div class="text-h6 mx-auto font-weight-bold text-center text-truncate">
        {{ snack_text }}
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { useUIStore } from '@/stores';
import { data } from '@/plugins/data';
import GifDialog from './GifDialog.vue';
import { FRAME_RATE, MYGO_FRAME_OFFSETS, SEASON_NAMES, Season } from '@/constants/filters';

const uiStore = useUIStore();
const gifDialogRef = ref<InstanceType<typeof GifDialog> | null>(null);
import settings from '../assets/setting.json';
const props = defineProps({
  styles: {
    type: Object,
    required: true,
  },
  cardData: {
    type: Object as PropType<data.Info>,
    required: true,
  },
});

const text = props.cardData.text;
const season = props.cardData.season;
const episode = props.cardData.episode;
const frame_start = props.cardData.frameStart;
const framePrefer = props.cardData.framePrefer;

const session = season == Season.AVE_MUJICA ? SEASON_NAMES[Season.AVE_MUJICA] : SEASON_NAMES[Season.MYGO];
const episodeText = `${session} 第${episode}話`;

const episodeKey = `${episode}` as keyof typeof settings.videoLink[typeof session];
const videoLink = settings.videoLink[session][episodeKey];

const urlSec = Math.round((props.cardData.frameStart + (season == Season.MYGO ? MYGO_FRAME_OFFSETS[episode] : 0)) / FRAME_RATE);
const videoLinkWithTimestamp = `${videoLink}&t=${urlSec}s`;

const totalSec = frame_start / FRAME_RATE;
const timestamp = `${Math.floor(totalSec / 60)}:${('0' + Math.floor(totalSec % 60)).slice(-2)}`;

const baseUrl = 'https://mypic.0m0.uk/images/';
const imgUrl = computed(() => `${baseUrl}${season}/${episode}/${framePrefer}.webp`);

const showDialog = ref(false);
const copyResult = ref(false);
const snack_text = ref('連結複製成功');
const isDownloading = ref(false);
const isCopying = ref(false);
const isGifCreating = ref(false);

async function downloadImage() {
  if (isDownloading.value) return;
  isDownloading.value = true;
  snack_text.value = '下載中...';
  copyResult.value = true;

  try {
    const dlUrl = await getPngBlob();
    const response = await fetch(dlUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${text}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    snack_text.value = '下載完成';
  } catch (error) {
    reportErrorToDiscord(error as Error);
    snack_text.value = '下載失敗';
  } finally {
    isDownloading.value = false;
    copyResult.value = true;
  }
}

var isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
let isLongPress = false;
const copy = async (longPress: boolean) => {
  if (isLongPress && !longPress) {
    isLongPress = false;
    return;
  }
  if (longPress) {
    isLongPress = true;
    if (isSafari) {
      snack_text.value = '因瀏覽器限制，不支援長按複製連結';
      copyResult.value = true;
      return;
    }
  }

  if (isCopying.value) return;
  isCopying.value = true;
  copyResult.value = false;
  const preferCopyURL = longPress || uiStore.copyMode;
  try {
    if (preferCopyURL) {
      await copyUrl();
    } else {
      await copyImage();
    }
  } catch (e: any) {
    reportErrorToDiscord(e);
    if (isSafari) {
      snack_text.value = '複製失敗，請稍後重試，或切換為複製連結';
    } else {
      try {
        await copyUrl();
        snack_text.value = "複製圖片失敗，已複製連結";
      } catch (e: any) {
        console.error('Error during copy:', e.message);
        snack_text.value = '失敗 請按左下角回報手機型號/瀏覽器';
        reportErrorToDiscord(e);
      }
    }
  } finally {
    isCopying.value = false;
    copyResult.value = true;
  }
}

const copyUrl = async () => {
  await navigator.clipboard.writeText(imgUrl.value);
  snack_text.value = '連結複製成功';
}

const copyImage = async () => {
  const item = new ClipboardItem({
    'image/png': (async () => {
      const blobUrl = await getPngBlob();
      const data = await fetch(blobUrl);
      return await data.blob();
    })(),
  });
  await navigator.clipboard.write([item]);
  snack_text.value = "圖片複製成功";
}

const offscreenCanvas = (() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {
    alpha: false, // 不需要透明通道
    willReadFrequently: true // 優化頻繁讀取
  }) ?? new CanvasRenderingContext2D;
  return { canvas, ctx };
})();

var blobUrl = '';
async function getPngBlob() {
  if (blobUrl) {
    return blobUrl;
  }
  let img = new Image();
  img.src = imgUrl.value;
  img.crossOrigin = 'Anonymous';
  img.style.display = 'none';
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const { canvas, ctx } = offscreenCanvas;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  blobUrl = canvas.toDataURL("image/png");
  return blobUrl;
}

async function reportErrorToDiscord(e: Error) {
  const payload = {
    content: `Copy failed: ${e.name}\n\n${navigator.userAgent}\n\n${e.message}\n\n${e.stack}`
  };

  try {
    await fetch(`https://discord.com/api/webhooks/${atob(settings.webhook)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (fetchError) {
    console.error('Failed to send error report to Discord:', fetchError);
  }
}
</script>

<style scoped>
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
