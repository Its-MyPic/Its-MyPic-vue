<template>
  <v-footer app>
    <v-container fluid :style="{ padding: '5px' }">
      <v-row>
        <v-col>
          <v-btn variant="text" size="small" class="text-center">
            其他連結
            <v-menu activator="parent" location="center">
              <v-list>
                <v-icon :icon="`mdiSvg:${mdiOpenInNew}`"></v-icon>
                <v-list-item :key="0" target="_blank" :value="0" :append-icon="mdiOpenInNew"
                  href="https://github.com/NightFeather0615/Its-MyPic-Android">
                  <v-list-item-title>Its-MyPic for Android</v-list-item-title>
                </v-list-item>

                <v-list-item :key="1" target="_blank" :value="1" :append-icon="mdiOpenInNew"
                  href="https://github.com/Its-MyPic/PowerToys-Run-Its-MyPic">
                  <v-list-item-title>PowerToys-Run Plugin</v-list-item-title>
                </v-list-item>

                <v-list-item :key="2" target="_blank" :value="2" :append-icon="mdiOpenInNew"
                  href="https://github.com/Its-MyPic/krunner-Its-MyPic">
                  <v-list-item-title>Krunner Plugin</v-list-item-title>
                </v-list-item>

                <v-list-item :key="3" target="_blank" :value="3" :append-icon="mdiOpenInNew"
                  href="https://github.com/Its-MyPic/Its-MyPic-vue">
                  <v-list-item-title>這個網頁的原始碼</v-list-item-title>
                </v-list-item>

                <v-list-item :key="4" target="_blank" :value="4" :append-icon="mdiOpenInNew"
                  href="https://github.com/Its-MyPic/Its-MyPicDB">
                  <v-list-item-title>mygo系列的截圖資料</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
          <v-btn variant="text" size="small" class="text-center">
            回報問題
            <ReportDialog />
          </v-btn>
          <v-btn variant="text" size="small" class="text-center" :href="`https://forms.gle/WzW9PZwUU6gqHZko7`"
            target="_blank">
            投稿
          </v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn variant="text" size="small" density="comfortable" :icon="mdiCog">
            <v-icon :icon="mdiCog" aria-label="設定" />

            <v-dialog activator="parent" max-width="600px" :style="{ maxHeight: '90vh', minHeight: '200px' }">
              <v-card class="d-flex flex-column align-center justify-center font-weight-bold">
                <br />
                <span class="ml-2 d-flex align-center">主題</span>
                <v-col cols="auto" class="d-flex align-center">
                  <span class="mr-2 d-flex align-center">淺色</span>
                  <v-switch v-model="isDarkTheme" class="mx-2 d-flex align-center"></v-switch>
                  <span class="ml-2 d-flex align-center">深色</span>
                </v-col>
                <br />

                <span class="ml-2 d-flex align-center">偏好複製模式</span>
                <v-col cols="auto" class="d-flex align-center">
                  <span class="mr-2 d-flex align-center">複製圖片</span>
                  <v-switch v-model="copyModeBind" class="mx-2 d-flex align-center"
                    :disabled="!canCopyImage"></v-switch>
                  <span class="ml-2 d-flex align-center">複製連結</span>
                </v-col>
                <span class="ml-2 d-flex align-center" v-if="!canCopyImage">您的瀏覽器不支援複製圖片</span>
                <br />
              </v-card>
            </v-dialog>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { mdiOpenInNew, mdiCog } from '@mdi/js';
import { useTheme } from 'vuetify'
import { useUIStore } from '@/stores';

const uiStore = useUIStore();

const canCopyImage = ref(true);
const isDarkTheme = computed({ 
  get() { return theme.global.current.value.dark }, 
  set(newValue) { toggleTheme(newValue) } 
});
const copyModeBind = computed({ 
  get() { return uiStore.copyMode }, 
  set(newValue) { 
    uiStore.copyMode = newValue; 
    localStorage.setItem('copyURLMode', newValue.toString()); 
  } 
});

// const copyURLMode = defineModel('copyUrlMode', { type: Boolean, required: true });
const theme = useTheme();


function toggleTheme(newValue: boolean) {
  theme.global.name.value = newValue ? 'dark' : 'light';
  localStorage.setItem('darkTheme', theme.global.name.value);
}

const isFirefox = () => {
  return typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');
};

const isMobile = () => {
  return typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('mobile');
};

const hasPermission = () => {
  return true;
};

const checkCanCopyImage = () => {
  return hasPermission() && !(isFirefox() && isMobile());
};

onMounted(() => {
  canCopyImage.value = checkCanCopyImage();

  if (!canCopyImage.value) {
    uiStore.copyMode = true;
  } else if (localStorage.getItem('copyURLMode')) {
    uiStore.copyMode = localStorage.getItem('copyURLMode') === 'true';
  } else {
    uiStore.copyMode = false;
  }
  // console.log(copyURLMode.copyMode);

  if (localStorage.getItem('darkTheme')) {
    theme.global.name.value = localStorage.getItem('darkTheme') ?? 'dark';
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    theme.global.name.value = 'light';
  }
})
</script>
