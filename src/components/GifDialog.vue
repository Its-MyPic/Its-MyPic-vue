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
import { ref } from 'vue';
import settings from '../assets/setting.json';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { generateImageUrl } from '@/utils/urlUtils';
import { useUIStore } from '@/stores';
const uiStore = useUIStore();
const ffmpeg = new FFmpeg();
let ffmpegLoaded = false;


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

async function ensureFFmpegLoaded() {
  if (!ffmpegLoaded) {
    await ffmpeg.load();
    ffmpegLoaded = true;
  }
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
  formData.append("fileToUpload", file);
  formData.append("reqtype", "fileupload");

  const response = await fetch("https://cors.0m0.uk/?https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData
  });

  if (response.status === 412) {
    throw new Error('GIF檔案過大，請自行下載後上傳至其他圖床');
  }

  const link = await response.text();

  return link;
}

async function generateGifLink() {
  if (!generatedGifBlob.value) return;
  isGeneratingLink.value = true;

  const item = new ClipboardItem({
    'text/plain': (async () => {
      if (cachedImgurUrl.value) {
        return new Blob([cachedImgurUrl.value], { type: 'text/plain' });
      }

      snackText.value = '正在上傳GIF...';
      copyResult.value = true;

      const imgurUrl = await uploadToImgur();
      cachedImgurUrl.value = imgurUrl;
      return new Blob([imgurUrl], { type: 'text/plain' });
    })(),
  });

  try {
    await navigator.clipboard.write([item]);
    snackText.value = 'GIF 連結複製成功';
  } catch (error) {
    if (error instanceof Error && error.name === 'NotAllowedError') {
      snackText.value = 'GIF 連結複製失敗';
    } else {
      snackText.value = error instanceof Error ? error.message : 'GIF 上傳失敗';
    }
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

  cachedImgurUrl.value = null;
  isGeneratingGif.value = true;
  snackText.value = 'GIF生成中...';
  copyResult.value = true;

  const startTime = performance.now();
  const frames = Array.from(
    { length: props.frameEnd - props.frameStart - 4 },
    (_, i) => props.frameStart + i + 2
  );

  try {
    await ensureFFmpegLoaded();


    // Download and write frames to virtual filesystem in parallel
    const downloadPromises = frames.map(async (frame: number) => {
      const frameUrl = generateImageUrl(baseUrl, props.season, props.episode, frame, uiStore.wayBackMode);
      const frameData = await fetchFile(frameUrl);
      await ffmpeg.writeFile(`${frame}.webp`, frameData);
    });
    await Promise.all(downloadPromises);

    // First generate a palette
    await ffmpeg.exec([
      '-start_number', frames[0].toString(),
      '-i', '%d.webp',
      '-vf', 'palettegen',
      'palette.png'
    ]);

    // Then use the palette to generate high quality GIF
    await ffmpeg.exec([
      '-start_number', frames[0].toString(),
      '-i', '%d.webp',
      '-i', 'palette.png',
      '-filter_complex', 'paletteuse=dither=none',
      '-frames:v', frames.length.toString(),
      '-f', 'gif',
      '-framerate', '24',
      'output.gif'
    ]);

    // Read the output file and create blob
    const uint8Array = await ffmpeg.readFile('output.gif');
    generatedGifBlob.value = new Blob([uint8Array], { type: 'image/gif' });
    generatedGifUrl.value = URL.createObjectURL(generatedGifBlob.value);

    const endTime = performance.now();
    const timeSpent = ((endTime - startTime) / 1000).toFixed(1);
    snackText.value = `GIF生成完成 (${timeSpent}秒)`;
    showDialog.value = true;

  } catch (error) {
    console.error('GIF generation failed:', error);
    reportErrorToDiscord(error as Error);
    snackText.value = 'GIF生成失敗';
  } finally {
    isGeneratingGif.value = false;
    copyResult.value = true;

    // Cleanup virtual filesystem in parallel
    const frameCleanupPromises = frames.map((frame: number) =>
      ffmpeg.deleteFile(`${frame}.webp`).catch(console.error)
    );
    await Promise.all([
      ...frameCleanupPromises,
      ffmpeg.deleteFile('output.gif').catch(console.error),
      ffmpeg.deleteFile('palette.png').catch(console.error)
    ]);
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
  isGeneratingGif,
});
</script>
