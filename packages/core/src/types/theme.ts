export interface GridTheme {
  borderColor?: string;
  background?: string;
  backgroundHeader?: string;
  backgroundHover?: string;
  backgroundSelected?: string;
  text?: string;
  textMuted?: string;
  accent?: string;
  accentHover?: string;
  focusRing?: string;
  pinnedShadow?: string;
}

export const defaultLightTheme: GridTheme = {
  borderColor: 'rgb(229 231 235)',
  background: 'rgb(255 255 255)',
  backgroundHeader: 'rgb(249 250 251)',
  backgroundHover: 'rgb(243 244 246)',
  backgroundSelected: 'rgb(239 246 255)',
  text: 'rgb(17 24 39)',
  textMuted: 'rgb(107 114 128)',
  accent: 'rgb(59 130 246)',
  accentHover: 'rgb(37 99 235)',
  focusRing: 'rgb(59 130 246)',
  pinnedShadow: '4px 0 8px -2px rgba(0, 0, 0, 0.12)',
};

export const defaultDarkTheme: GridTheme = {
  borderColor: 'rgb(55 65 81)',
  background: 'rgb(17 24 39)',
  backgroundHeader: 'rgb(31 41 55)',
  backgroundHover: 'rgb(55 65 81)',
  backgroundSelected: 'rgb(30 58 138)',
  text: 'rgb(243 244 246)',
  textMuted: 'rgb(156 163 175)',
  accent: 'rgb(59 130 246)',
  accentHover: 'rgb(37 99 235)',
  focusRing: 'rgb(59 130 246)',
  pinnedShadow: '4px 0 8px -2px rgba(0, 0, 0, 0.45)',
};

export function themeToCssVars(theme: GridTheme): Record<string, string> {
  const map: Record<string, string> = {};
  if (theme.borderColor) map['--osdg-border-color'] = theme.borderColor;
  if (theme.background) map['--osdg-bg'] = theme.background;
  if (theme.backgroundHeader) map['--osdg-bg-header'] = theme.backgroundHeader;
  if (theme.backgroundHover) map['--osdg-bg-row-hover'] = theme.backgroundHover;
  if (theme.backgroundSelected) map['--osdg-bg-row-selected'] = theme.backgroundSelected;
  if (theme.text) map['--osdg-text'] = theme.text;
  if (theme.textMuted) map['--osdg-text-muted'] = theme.textMuted;
  if (theme.accent) map['--osdg-accent'] = theme.accent;
  if (theme.accentHover) map['--osdg-accent-hover'] = theme.accentHover;
  if (theme.focusRing) map['--osdg-focus-ring'] = theme.focusRing;
  if (theme.pinnedShadow) map['--osdg-pinned-shadow'] = theme.pinnedShadow;
  return map;
}
