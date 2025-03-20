<template>
  <v-dialog v-model="showDialog" max-width="600px" :style="{ maxHeight: '90vh' }">
    <v-card>
      <v-img :src="generatedGifUrl" :style="{ maxHeight: '70vh', objectFit: 'contain' }" />
      <v-card-actions>
        <v-row>
          <v-btn @click="downloadGeneratedGif" :loading="isDownloading">下載</v-btn>
          <v-btn @click="generateGifLink" :loading="isGeneratingLink">生成連結</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="copyResult" :timeout=2000 class="text-center" rounded="pill">
    <div class="text-h6 mx-auto font-weight-bold text-center text-truncate">
      {{ snackText }}
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import GIF from 'gif.js';
import settings from '../assets/setting.json';

const props = defineProps<{
  text: string
  season: number
  episode: number
  frameStart: number
  frameEnd: number
}>();

const baseUrl = 'https://mypic.0m0.uk/images/';

const showDialog = ref(false);
const copyResult = ref(false);
const snackText = ref('');
const isGeneratingGif = ref(false);
const isDownloading = ref(false);
const isGeneratingLink = ref(false);
const generatedGifUrl = ref('');
const generatedGifBlob = ref<Blob | null>(null);
const cachedImgurUrl = ref<string | null>(null);

async function convertWebpToPng(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', {
        alpha: false,
        willReadFrequently: true
      });
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function downloadGeneratedGif() {
  if (!generatedGifBlob.value) return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(generatedGifBlob.value);
  link.download = `${props.text}.gif`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

async function uploadToImgur(): Promise<string> {
  const file = new File([generatedGifBlob.value!], `download.gif`, { type: 'image/gif' });
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", props.text);
  
  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID b3c5e3525785e29`
    },
    body: formData
  });
  
  const data = await response.json();
  const imgurLink = data.data.link;
  if (!imgurLink) throw new Error('Upload failed');
  
  return imgurLink;
}

async function generateGifLink() {
  if (!generatedGifBlob.value) return;
  isGeneratingLink.value = true;

  const item = new ClipboardItem({
    'text/plain': (async () => {
      try {
        if (cachedImgurUrl.value) {
          return new Blob([cachedImgurUrl.value], { type: 'text/plain' });
        }

        snackText.value = '正在上傳GIF...';
        copyResult.value = true;

        const imgurUrl = await uploadToImgur();
        cachedImgurUrl.value = imgurUrl;
        return new Blob([imgurUrl], { type: 'text/plain' });
      } catch (error) {
        console.error('GIF upload failed:', error);
        snackText.value = 'GIF 上傳失敗';
        reportErrorToDiscord(error as Error);
        throw error;
      }
    })(),
  });

  try {
    await navigator.clipboard.write([item]);
    snackText.value = 'GIF 連結複製成功';
  } catch (error) {
    console.error('Clipboard write failed:', error);
    snackText.value = 'GIF 連結複製失敗';
    reportErrorToDiscord(error as Error);
  } finally {
    copyResult.value = true;
    isGeneratingLink.value = false;
  }
}

async function CreateGif() {
  if (isGeneratingGif.value) return;
  if (generatedGifBlob.value) {
    showDialog.value = true;
    return;
  }
  // Reset cached URL when creating new GIF
  cachedImgurUrl.value = null;
  isGeneratingGif.value = true;
  snackText.value = 'GIF生成中...';
  copyResult.value = true;

  const startTime = performance.now();
  try {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: '/gif.worker.js',
    });

    const frames = Array.from(
      { length: props.frameEnd - props.frameStart - 4 },
      (_, i) => props.frameStart + i + 2
    );

    const framePromises = frames.map(frame => {
      const frameUrl = `${baseUrl}${props.season}/${props.episode}/${frame}.webp`;
      return convertWebpToPng(frameUrl);
    });

    const images = await Promise.all(framePromises);

    const frameDelay = Math.round(1000 / 23.976);
    images.forEach(img => {
      gif.addFrame(img, { delay: frameDelay });
    });

    gif.on('finished', (blob: Blob) => {
      generatedGifBlob.value = blob;
      generatedGifUrl.value = URL.createObjectURL(blob);
      const endTime = performance.now();
      const timeSpent = ((endTime - startTime) / 1000).toFixed(1);
      isGeneratingGif.value = false;
      snackText.value = `GIF生成完成 (${timeSpent}秒)`;
      copyResult.value = true;
      showDialog.value = true;
    });

    (gif as any).on('error', (error: Error) => {
      reportErrorToDiscord(error);
      isGeneratingGif.value = false;
      snackText.value = 'GIF生成失敗';
      copyResult.value = true;
    });

    gif.render();
  } catch (error) {
    reportErrorToDiscord(error as Error);
    isGeneratingGif.value = false;
    snackText.value = 'GIF生成失敗';
    copyResult.value = true;
  }
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

defineExpose({
  CreateGif,
});
</script>
