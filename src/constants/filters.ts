export type VideoLinkConfig = {
  'MyGO': { [key: string]: string };
  'Ave Mujica': { [key: string]: string };
};

export const enum Season {
  MYGO = 1,
  AVE_MUJICA = 2
}

export const SEASON_NAMES = {
  [Season.MYGO]: 'MyGO',
  [Season.AVE_MUJICA]: 'Ave Mujica'
} as const;

export const EPISODES = Array.from({ length: 13 }, (_, i) => i + 1)
// For timestamp calculation
export const FRAME_RATE = 23.976;

export const MYGO_FRAME_OFFSETS = [
  0,  // Episode 1
  0,  // Episode 2
  34288,  // Episode 3
  68333,  // Episode 4
  0,  // Episode 5
  0,  // Episode 6
  0,  // Episode 7
  0,  // Episode 8
  0,  // Episode 9
  0,  // Episode 10
  0,  // Episode 11
  0,  // Episode 12
  0   // Episode 13
] as const;
