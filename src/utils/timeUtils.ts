import { FRAME_RATE } from "@/constants/filters";

export function calculateTimeFromFrames(frameStart: number): {
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const totalSeconds = frameStart / FRAME_RATE;
  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: Math.floor(totalSeconds % 60),
    totalSeconds: Math.round(totalSeconds)
  };
}

export function formatTimestamp(timeData: { minutes: number; seconds: number }): string {
  return `${timeData.minutes}:${String(timeData.seconds).padStart(2, '0')}`;
}

export function calculateTimestamp(frameStart: number): string {
  const timeData = calculateTimeFromFrames(frameStart);
  return formatTimestamp(timeData);
}

export function calculateVideoTimestamp(
  frameStart: number,
  seasonOffsets: readonly number[],
  episodeNumber: number,
  isSeason1: boolean
): number {
  const offset = isSeason1 ? seasonOffsets[episodeNumber] : 0;
  return Math.round((frameStart + offset) / FRAME_RATE);
}
