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
            <v-btn @click="downloadGif" :loading="isGeneratingGif">GIF</v-btn>
            <v-btn v-long-press="() => copy(true)" @click="() => copy(false)" :loading="isCopying">複製</v-btn>
            <v-btn :href="videoLinkWithTimestamp" target="_blank">
              從這裡開始看
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="copyResult" :timeout=2000 class="text-center" rounded="pill">
      <div class="text-h6 mx-auto font-weight-bold text-center text-truncate">
        {{ snack_text }}
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { useCopyMode } from '@/stores/states';
import { data } from '@/plugins/data';
import GIF from 'gif.js';

const copyURLMode = useCopyMode();

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

const session = season == 2 ? 'Ave Mujica' : 'MyGO';
const episodeText = `${session} 第${episode}話`;

const episodeKey = `${episode}` as keyof typeof settings.videoLink[typeof session];
const videoLink = settings.videoLink[session][episodeKey];

const offset = [0, 0, 34288, 68333, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const urlSec = Math.round((props.cardData.frameStart + (season == 1 ? offset[episode] : 0)) / 23.976);
const videoLinkWithTimestamp = `${videoLink}&t=${urlSec}s`;

const totalSec = frame_start / 23.976;
const timestamp = `${Math.floor(totalSec / 60)}:${('0' + Math.floor(totalSec % 60)).slice(-2)}`;

const baseUrl = 'https://mypic.0m0.uk/images/';
const imgUrl = computed(() => `${baseUrl}${season}/${episode}/${framePrefer}.webp`);

const showDialog = ref(false);
const copyResult = ref(false);
const snack_text = ref('連結複製成功');
const isGeneratingGif = ref(false);
const isDownloading = ref(false);
const isCopying = ref(false);

async function convertWebpToPng(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function downloadGif() {
  if (isGeneratingGif.value) return;
  isGeneratingGif.value = true;
  snack_text.value = 'GIF生成中...';
  copyResult.value = true;

  const startTime = performance.now();
  try {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: '/gif.worker.js',
    });

    // Create array of frame numbers
    const frames = Array.from(
      { length: props.cardData.frameEnd - props.cardData.frameStart - 4 },
      (_, i) => props.cardData.frameStart + i + 2
    );

    // Fetch all frames in parallel
    const framePromises = frames.map(frame => {
      const frameUrl = `${baseUrl}${season}/${episode}/${frame}.webp`;
      return convertWebpToPng(frameUrl);
    });

    // Wait for all frames to load
    const images = await Promise.all(framePromises);

    // Add all frames to gif
    const frameDelay = Math.round(1000 / 23.976);
    images.forEach(img => {
      gif.addFrame(img, { delay: frameDelay });
    });

    // Render and download
    gif.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${text}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      const endTime = performance.now();
      const timeSpent = ((endTime - startTime) / 1000).toFixed(1);
      isGeneratingGif.value = false;
      snack_text.value = `GIF下載完成 (${timeSpent}秒)`;
      copyResult.value = true;
    });

    // Using any to work around gif.js type definition limitations
    (gif as any).on('error', (error: Error) => {
      reportErrorToDiscord(error);
      isGeneratingGif.value = false;
      snack_text.value = 'GIF生成失敗';
      copyResult.value = true;
    });

    gif.render();
  } catch (error) {
    reportErrorToDiscord(error as Error);
    isGeneratingGif.value = false;
    snack_text.value = 'GIF生成失敗';
    copyResult.value = true;
  }
}

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
  const preferCopyURL = longPress || copyURLMode.copyMode;
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

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d') ?? new CanvasRenderingContext2D();
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
