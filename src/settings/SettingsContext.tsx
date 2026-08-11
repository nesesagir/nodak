import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LangId, TranslationKey } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';
import { getTheme, type ThemeId } from './themes';

const STORAGE_KEY = 'nodak.settings.v7';
const FORCE_CLASSIC_FLAG = 'nodak.forceClassic.v2';

export type SettingsState = {
  language: LangId;
  themeId: ThemeId;
  backgroundColor: string;
  boardColor: string;
  soundEnabled: boolean;
};

export const PLAIN_DEFAULTS: SettingsState = {
  language: 'tr',
  themeId: 'mist',
  backgroundColor: '#FFFFFF',
  boardColor: '#FFFFFF',
  soundEnabled: true,
};

type SettingsContextValue = SettingsState & {
  ready: boolean;
  setLanguage: (language: LangId) => void;
  setThemeId: (themeId: ThemeId) => void;
  setBackgroundColor: (color: string) => void;
  setBoardColor: (color: string) => void;
  setSoundEnabled: (soundEnabled: boolean) => void;
  applyThemeDefaults: (themeId: ThemeId) => void;
  resetToPlain: () => void;
  t: (key: TranslationKey) => string;
  theme: ReturnType<typeof getTheme>;
  isDark: boolean;
  isPlain: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function isDarkColor(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function isPlainState(state: SettingsState): boolean {
  return (
    state.themeId === PLAIN_DEFAULTS.themeId &&
    state.backgroundColor.toLowerCase() ===
      PLAIN_DEFAULTS.backgroundColor.toLowerCase() &&
    state.boardColor.toLowerCase() === PLAIN_DEFAULTS.boardColor.toLowerCase()
  );
}

async function clearNodakSettingsKeys(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const settingsOnly = keys.filter(
    (key) => key.startsWith('nodak.settings') || key.startsWith('nodus.settings'),
  );
  if (settingsOnly.length > 0) {
    await AsyncStorage.multiRemove(settingsOnly);
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<SettingsState>(PLAIN_DEFAULTS);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const forced = await AsyncStorage.getItem(FORCE_CLASSIC_FLAG);
        if (!forced) {
          await clearNodakSettingsKeys();
          await AsyncStorage.setItem(FORCE_CLASSIC_FLAG, '1');
          if (!alive) return;
          setState(PLAIN_DEFAULTS);
          return;
        }

        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!alive) return;
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SettingsState>;
          setState({
            language: parsed.language ?? PLAIN_DEFAULTS.language,
            themeId: parsed.themeId ?? PLAIN_DEFAULTS.themeId,
            backgroundColor:
              parsed.backgroundColor ?? PLAIN_DEFAULTS.backgroundColor,
            boardColor: parsed.boardColor ?? PLAIN_DEFAULTS.boardColor,
            soundEnabled:
              typeof parsed.soundEnabled === 'boolean'
                ? parsed.soundEnabled
                : PLAIN_DEFAULTS.soundEnabled,
          });
        } else {
          const legacy =
            (await AsyncStorage.getItem('nodak.settings.v6')) ??
            (await AsyncStorage.getItem('nodus.settings.v6')) ??
            (await AsyncStorage.getItem('nodus.settings.v5'));
          if (legacy) {
            const parsed = JSON.parse(legacy) as Partial<SettingsState>;
            setState({
              language: parsed.language ?? PLAIN_DEFAULTS.language,
              themeId: parsed.themeId ?? PLAIN_DEFAULTS.themeId,
              backgroundColor:
                parsed.backgroundColor ?? PLAIN_DEFAULTS.backgroundColor,
              boardColor: parsed.boardColor ?? PLAIN_DEFAULTS.boardColor,
              soundEnabled: PLAIN_DEFAULTS.soundEnabled,
            });
          } else {
            setState(PLAIN_DEFAULTS);
          }
        }
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const setLanguage = useCallback((language: LangId) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const setThemeId = useCallback((themeId: ThemeId) => {
    setState((prev) => ({ ...prev, themeId }));
  }, []);

  const setBackgroundColor = useCallback((backgroundColor: string) => {
    setState((prev) => ({ ...prev, backgroundColor }));
  }, []);

  const setBoardColor = useCallback((boardColor: string) => {
    setState((prev) => ({ ...prev, boardColor }));
  }, []);

  const setSoundEnabled = useCallback((soundEnabled: boolean) => {
    setState((prev) => ({ ...prev, soundEnabled }));
  }, []);

  const applyThemeDefaults = useCallback((themeId: ThemeId) => {
    const theme = getTheme(themeId);
    setState((prev) => ({
      ...prev,
      themeId,
      backgroundColor: theme.defaultBg,
      boardColor: theme.defaultBoard,
    }));
  }, []);

  const resetToPlain = useCallback(() => {
    setState((prev) => ({
      ...PLAIN_DEFAULTS,
      language: prev.language,
      soundEnabled: prev.soundEnabled,
    }));
  }, []);

  const theme = getTheme(state.themeId);
  const isDark = isDarkColor(state.backgroundColor);
  const isPlain = isPlainState(state);

  const t = useCallback(
    (key: TranslationKey) => TRANSLATIONS[state.language][key],
    [state.language],
  );

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...state,
      ready,
      setLanguage,
      setThemeId,
      setBackgroundColor,
      setBoardColor,
      setSoundEnabled,
      applyThemeDefaults,
      resetToPlain,
      t,
      theme,
      isDark,
      isPlain,
    }),
    [
      state,
      ready,
      setLanguage,
      setThemeId,
      setBackgroundColor,
      setBoardColor,
      setSoundEnabled,
      applyThemeDefaults,
      resetToPlain,
      t,
      theme,
      isDark,
      isPlain,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
