interface CanvasContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export function useCanvas(): {
  getContext: () => CanvasContext;
  createPngBlob: (image: HTMLImageElement) => Promise<string>;
  cleanup: () => void;
} {
  let context: CanvasContext | null = null;

  const getContext = (): CanvasContext => {
    if (context) return context;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {
      alpha: false,
      willReadFrequently: true
    });

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    context = { canvas, ctx };
    return context;
  };

  const createPngBlob = async (image: HTMLImageElement): Promise<string> => {
    const { canvas, ctx } = getContext();
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const cleanup = () => {
    if (context) {
      context.canvas.width = 0;
      context.canvas.height = 0;
      context = null;
    }
  };

  return {
    getContext,
    createPngBlob,
    cleanup
  };
}
