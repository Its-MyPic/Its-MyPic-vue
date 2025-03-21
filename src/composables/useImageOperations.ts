import { reactive, toRef } from 'vue';
import { useCanvas } from './useCanvas';
import { useErrorReporting } from './useErrorReporting';

interface ImageOperationsConfig {
  webhookUrl: string;
}

export function useImageOperations(config: ImageOperationsConfig) {
  const canvas = useCanvas();
  const errorReporting = useErrorReporting({
    webhookUrl: config.webhookUrl,
    context: 'ImageOperations'
  });

  // Unified reactive state
  const state = reactive({
    isDownloading: false,
    isCopying: false,
    operationStatus: ''
  });

  // Utility function to load an image
  const loadImage = async (url: string): Promise<HTMLImageElement> => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  // Download image
  const downloadImage = async (imageUrl: string, filename: string) => {
    if (state.isDownloading) return;
    
    errorReporting.trackAction(`download_image_start:${filename}`);
    state.isDownloading = true;
    state.operationStatus = '下載中...';

    try {
      const img = await loadImage(imageUrl);
      const blobUrl = await canvas.createPngBlob(img);
      
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      state.operationStatus = '下載完成';
      errorReporting.trackAction(`download_image_success:${filename}`);
    } catch (error) {
      errorReporting.trackAction(`download_image_error:${filename}`);
      await errorReporting.reportError(error as Error, undefined, {
        imageUrl,
        filename,
        operation: 'download'
      });
      state.operationStatus = '下載失敗';
    } finally {
      state.isDownloading = false;
    }
  };

  // Copy image
  const copyImage = async (imageUrl: string) => {
    if (state.isCopying) return;
    
    errorReporting.trackAction(`copy_image_start`);
    state.isCopying = true;
    state.operationStatus = '';

    try {
      const img = await loadImage(imageUrl);
      const blobUrl = await canvas.createPngBlob(img);
      
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      
      const item = new ClipboardItem({
        'image/png': blob
      });
      
      await navigator.clipboard.write([item]);
      state.operationStatus = '圖片複製成功';
      errorReporting.trackAction(`copy_image_success`);
    } catch (error) {
      errorReporting.trackAction(`copy_image_error`);
      await errorReporting.reportError(error as Error, undefined, {
        imageUrl,
        operation: 'copyImage',
        clipboardSupported: Boolean(navigator.clipboard)
      });
      state.operationStatus = '複製失敗，請稍後重試';
      throw error;
    } finally {
      state.isCopying = false;
    }
  };

  // Copy URL
  const copyUrl = async (url: string) => {
    if (state.isCopying) return;
    
    errorReporting.trackAction(`copy_url_start`);
    state.isCopying = true;
    state.operationStatus = '';

    try {
      await navigator.clipboard.writeText(url);
      state.operationStatus = '連結複製成功';
      errorReporting.trackAction(`copy_url_success`);
    } catch (error) {
      errorReporting.trackAction(`copy_url_error`);
      await errorReporting.reportError(error as Error, undefined, {
        url,
        operation: 'copyUrl',
        clipboardSupported: Boolean(navigator.clipboard)
      });
      state.operationStatus = '複製失敗';
      throw error;
    } finally {
      state.isCopying = false;
    }
  };

  // Cleanup when component is unmounted
  const cleanup = () => {
    canvas.cleanup();
    errorReporting.trackAction('image_operations_cleanup');
  };

  // Track component mounting
  errorReporting.trackComponent('ImageOperations', true);

  return {
    isDownloading: toRef(state, 'isDownloading'),
    isCopying: toRef(state, 'isCopying'),
    operationStatus: toRef(state, 'operationStatus'),
    downloadImage,
    copyImage,
    copyUrl,
    cleanup
  };
}
