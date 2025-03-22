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
  const loadImage = (url: string): HTMLImageElement => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    return img;
  };

  // Load image with onload event
  const loadImageWithEvents = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = loadImage(url);
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  // Download image
  const downloadImage = (imageUrl: string, filename: string): void => {
    if (state.isDownloading) return;
    
    errorReporting.trackAction(`download_image_start:${filename}`);
    state.isDownloading = true;
    state.operationStatus = '下載中...';

    const img = loadImage(imageUrl);
    img.onload = () => {
      const dataUrl = canvas.createPngBlob(img);
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      state.operationStatus = '下載完成';
      errorReporting.trackAction(`download_image_success:${filename}`);
      state.isDownloading = false;
    };
    img.onerror = () => {
      errorReporting.trackAction(`download_image_error:${filename}`);
      errorReporting.reportError(new Error('Failed to load image'), undefined, {
        imageUrl,
        filename,
        operation: 'download'
      });
      state.operationStatus = '下載失敗';
      state.isDownloading = false;
    };
  };

  // Copy image
  const copyImage = async (imageUrl: string): Promise<void> => {
    if (state.isCopying) return;
    
    errorReporting.trackAction(`copy_image_start`);
    state.isCopying = true;
    state.operationStatus = '';

    const blobPromise = new Promise<Blob>((resolve, reject) => {
      loadImageWithEvents(imageUrl)
        .then(img => {
          const dataUrl = canvas.createPngBlob(img);
          const arr = dataUrl.split(',');
          const bstr = atob(arr[1]);
          const n = bstr.length;
          const u8arr = new Uint8Array(n);
          
          for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
          }
          
          resolve(new Blob([u8arr], { type: 'image/png' }));
        })
        .catch(reject);
    });

    try {
      const item = new ClipboardItem({
        'image/png': blobPromise
      });
      
      await navigator.clipboard.write([item]);
      state.operationStatus = '圖片複製成功';
      errorReporting.trackAction(`copy_image_success`);
    } catch (error) {
      errorReporting.trackAction(`copy_image_error`);
      errorReporting.reportError(error as Error, undefined, {
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
  const copyUrl = async (url: string): Promise<void> => {
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
      errorReporting.reportError(error as Error, undefined, {
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
