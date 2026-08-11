import { useMemo } from 'react';
import { useSettings } from '../settings/SettingsContext';
import { colors as base } from './tokens';

export function useAppColors() {
  const { backgroundColor, boardColor, theme, isDark } = useSettings();

  return useMemo(() => {
    if (theme.id === 'mist') {
      const darkBg = isDarkColor(backgroundColor);
      return {
        bg: backgroundColor || base.bg,
        surface: darkBg ? '#1A1A1A' : base.surface,
        ink: darkBg ? '#F5F5F5' : base.ink,
        inkMuted: darkBg ? '#A0A0A0' : base.inkMuted,
        primary: darkBg ? '#F5F5F5' : base.primary,
        primarySoft: darkBg ? '#2A2A2A' : base.primarySoft,
        accent: darkBg ? '#F5F5F5' : base.accent,
        danger: base.danger,
        gridLine: darkBg ? '#3A3A3A' : base.gridLine,
        cellEmpty: boardColor || base.cellEmpty,
        cellClue: darkBg
          ? mix(boardColor || '#111111', '#FFFFFF', 0.12)
          : base.cellClue,
        cellBlocked: darkBg
          ? mix(backgroundColor, '#FFFFFF', 0.12)
          : '#BDBDBD',
        board: boardColor || base.cellEmpty,
      };
    }

    const dark = isDark;
    const ink = dark ? '#E8EEF4' : base.ink;
    const inkMuted = dark ? '#A7B3C0' : base.inkMuted;
    const surface = dark ? '#2A3340' : '#FFFFFF';
    const gridLine = dark ? '#4A5866' : mix(boardColor, '#6B7A86', 0.35);
    const cellEmpty = boardColor;
    const cellClue = dark
      ? mix(boardColor, '#000000', 0.14)
      : mix(boardColor, theme.accent, 0.2);
    const primarySoft = dark
      ? mix(boardColor, theme.accent, 0.3)
      : mix(boardColor, theme.accent, 0.32);

    return {
      bg: backgroundColor,
      surface,
      ink,
      inkMuted,
      primary: theme.accent,
      primarySoft,
      accent: theme.accent,
      danger: base.danger,
      gridLine,
      cellEmpty,
      cellClue,
      cellBlocked: dark
        ? mix(backgroundColor, '#000000', 0.2)
        : mix(backgroundColor, gridLine, 0.4),
      board: boardColor,
    };
  }, [backgroundColor, boardColor, theme, isDark]);
}

function isDarkColor(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function mix(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  if (!pa || !pb) return a;
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  if (h.length < 6) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex(n: number) {
  return Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
}
