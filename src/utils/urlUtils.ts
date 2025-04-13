import { Season, SEASON_NAMES, type VideoLinkConfig } from "@/constants/filters";
import settings from '@/assets/setting.json';

export function generateImageUrl(
  baseUrl: string,
  season: number,
  episode: number,
  framePrefer: number,
  old: boolean = false
): string {
  const suffix = old ? '?old' : '';
  return `${baseUrl}${season}/${episode}/${framePrefer}.webp${suffix}`;
}

export function generateVideoUrl(
  season: Season,
  episode: number,
  timestamp: number
): string {
  const sessionName = season === Season.AVE_MUJICA 
    ? SEASON_NAMES[Season.AVE_MUJICA] 
    : SEASON_NAMES[Season.MYGO];
    var videoConfig: VideoLinkConfig = settings.videoLink;
  const episodeKey = String(episode) as keyof typeof videoConfig[typeof sessionName];
  const videoLink = videoConfig[sessionName][episodeKey];

  return `${videoLink}&t=${timestamp}s`;
}

export function generateEpisodeText(season: Season, episode: number): string {
  const sessionName = season === Season.AVE_MUJICA 
    ? SEASON_NAMES[Season.AVE_MUJICA] 
    : SEASON_NAMES[Season.MYGO];
  return `${sessionName} 第${episode}話`;
}
