export type ThemeId =
  | 'mist'
  | 'ice'
  | 'fire'
  | 'wood'
  | 'wind'
  | 'night'
  | 'blossom';

export type VictoryEffect =
  | 'none'
  | 'iceCrack'
  | 'fireBurn'
  | 'woodBreak'
  | 'windBlow'
  | 'nightFade'
  | 'blossomBloom';

export type AmbientKind =
  | 'none'
  | 'sparkle'
  | 'embers'
  | 'dust'
  | 'drift'
  | 'stars'
  | 'petals';

export type ThemeDef = {
  id: ThemeId;
  labelTr: string;
  labelEn: string;
  defaultBg: string;
  defaultBoard: string;
  accent: string;
  victory: VictoryEffect;
  ambient: AmbientKind;
};

export const THEMES: ThemeDef[] = [
  {
    id: 'mist',
    labelTr: 'Varsayılan',
    labelEn: 'Default',
    defaultBg: '#FFFFFF',
    defaultBoard: '#FFFFFF',
    accent: '#111111',
    victory: 'none',
    ambient: 'none',
  },
  {
    id: 'ice',
    labelTr: 'Buz',
    labelEn: 'Ice',
    defaultBg: '#DCEAF5',
    defaultBoard: '#F2F8FC',
    accent: '#7EB6D9',
    victory: 'iceCrack',
    ambient: 'sparkle',
  },
  {
    id: 'fire',
    labelTr: 'Ateş',
    labelEn: 'Fire',
    defaultBg: '#F3E8E1',
    defaultBoard: '#FBF4EE',
    accent: '#E08A5D',
    victory: 'fireBurn',
    ambient: 'embers',
  },
  {
    id: 'wood',
    labelTr: 'Odun',
    labelEn: 'Wood',
    defaultBg: '#EDE4D6',
    defaultBoard: '#F7F0E6',
    accent: '#B08968',
    victory: 'woodBreak',
    ambient: 'dust',
  },
  {
    id: 'wind',
    labelTr: 'Rüzgar',
    labelEn: 'Wind',
    defaultBg: '#E4EFEA',
    defaultBoard: '#F4FAF7',
    accent: '#6FAE9A',
    victory: 'windBlow',
    ambient: 'drift',
  },
  {
    id: 'night',
    labelTr: 'Gece',
    labelEn: 'Night',
    defaultBg: '#1F2730',
    defaultBoard: '#2A3340',
    accent: '#8FA8C8',
    victory: 'nightFade',
    ambient: 'stars',
  },
  {
    id: 'blossom',
    labelTr: 'Çiçek',
    labelEn: 'Blossom',
    defaultBg: '#F5E8EE',
    defaultBoard: '#FBF3F6',
    accent: '#D4A0B5',
    victory: 'blossomBloom',
    ambient: 'petals',
  },
];

export function getTheme(id: ThemeId): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export const BG_PRESETS = [
  '#FFFFFF',
  '#F5F5F5',
  '#111111',
  '#DCEAF5',
  '#F3E8E1',
  '#EDE4D6',
  '#E4EFEA',
  '#F5E8EE',
  '#1F2730',
  '#2C3E50',
] as const;

export const BOARD_PRESETS = [
  '#FFFFFF',
  '#F5F5F5',
  '#111111',
  '#F2F8FC',
  '#FBF4EE',
  '#F7F0E6',
  '#F4FAF7',
  '#FBF3F6',
  '#2A3340',
  '#EEEEEE',
] as const;
