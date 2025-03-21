import { Season, SEASON_NAMES, type VideoLinkConfig } from "@/constants/filters";

export function generateImageUrl(
  baseUrl: string,
  season: number,
  episode: number,
  framePrefer: number
): string {
  return `${baseUrl}${season}/${episode}/${framePrefer}.webp`;
}

export function generateVideoUrl(
  videoConfig: VideoLinkConfig,
  season: Season,
  episode: number,
  timestamp: number
): string {
  const sessionName = season === Season.AVE_MUJICA 
    ? SEASON_NAMES[Season.AVE_MUJICA] 
    : SEASON_NAMES[Season.MYGO];
    
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
