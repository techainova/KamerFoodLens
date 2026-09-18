// src/hooks/useAppTheme.ts
// Fournit les couleurs KFL adaptées au thème actif (clair / sombre / système)

import { useColorScheme } from 'react-native';
import { useUIStore } from '@/store/ui.store';
import { useAccessibilityStore, type ContrastMode } from '@/store/accessibility.store';

export type AppColors = {
  cream:        string;
  surface:      string;
  surface2:     string;
  border:       string;
  borderStrong: string;
  divider:      string;
  ink:          string;
  inkSoft:      string;
  inkMute:      string;
  inkFaint:     string;
  primary:      string;
  primarySoft:  string;
  success:      string;
  error:        string;
  gold:         string;
  navy:         string;
  successSoft:  string;
  errorSoft:    string;
  goldSoft:     string;
  navySoft:     string;
  statusBar:    'dark-content' | 'light-content';
};

export const LIGHT: AppColors = {
  cream:        '#FBFAF8',
  surface:      '#FFFFFF',
  surface2:     '#F4F1ED',
  border:       '#DCD5CD',
  borderStrong: '#B8AFA5',
  divider:      '#ECE7E1',
  ink:          '#1F1A15',
  inkSoft:      '#4A413A',
  inkMute:      '#8C8278',
  inkFaint:     '#C9C2BB',
  primary:      '#E8591A',
  primarySoft:  '#FCE5D6',
  success:      '#2E7D32',
  error:        '#C62828',
  gold:         '#F9A825',
  navy:         '#1A237E',
  successSoft:  '#DDEAD8',
  errorSoft:    '#FBDCDC',
  goldSoft:     '#FBF3DC',
  navySoft:     '#E8EAF6',
  statusBar:    'dark-content',
};

export const DARK: AppColors = {
  cream:        '#14110E',
  surface:      '#1C1814',
  surface2:     '#25201B',
  border:       '#3A332D',
  borderStrong: '#574E45',
  divider:      '#2A2520',
  ink:          '#F2EBE3',
  inkSoft:      '#C9BFB4',
  inkMute:      '#847A6F',
  inkFaint:     '#4D453E',
  primary:      '#E8591A',
  primarySoft:  'rgba(232, 89, 26, 0.16)',
  success:      '#2E7D32',
  error:        '#C62828',
  gold:         '#F9A825',
  navy:         '#1A237E',
  successSoft:  'rgba(76, 175, 80, 0.16)',
  errorSoft:    '#2E1A1A',
  goldSoft:     '#2E2510',
  navySoft:     '#0E1230',
  statusBar:    'light-content',
};

function applyContrast(base: AppColors, mode: ContrastMode, isDark: boolean): AppColors {
  if (mode === 0) return base;
  if (isDark) {
    return {
      ...base,
      ink:      mode === 2 ? '#FFFFFF' : '#FAFAFA',
      inkSoft:  mode === 2 ? '#F0F0F0' : '#D5D0CB',
      inkMute:  mode === 2 ? '#D0D0D0' : '#A39C95',
      border:   mode === 2 ? '#FFFFFF' : '#6A6A6E',
      surface:  mode === 2 ? '#000000' : base.surface,
      cream:    mode === 2 ? '#000000' : base.cream,
      surface2: mode === 2 ? '#1A1A1A' : base.surface2,
    };
  }
  return {
    ...base,
    ink:      '#000000',
    inkSoft:  mode === 2 ? '#000000' : '#3A2418',
    inkMute:  mode === 2 ? '#1A1A1A' : '#4A3A30',
    border:   mode === 2 ? '#000000' : '#A89A8C',
    surface:  mode === 2 ? '#FFFFFF' : base.surface,
    cream:    mode === 2 ? '#FFFFFF' : base.cream,
    surface2: mode === 2 ? '#F0F0F0' : base.surface2,
  };
}

export function useAppTheme() {
  const themeMode    = useUIStore(s => s.themeMode);
  const systemScheme = useColorScheme();
  const contrastMode = useAccessibilityStore(s => s.contrastMode);

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemScheme === 'dark');

  const base   = isDark ? DARK : LIGHT;
  const colors = applyContrast(base, contrastMode, isDark);

  return { colors, isDark, themeMode };
}

export function useColors(): AppColors {
  return useAppTheme().colors;
}
