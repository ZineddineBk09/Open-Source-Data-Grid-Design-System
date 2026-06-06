import type { Config } from 'tailwindcss';

export const osdgTheme = {
  '--osdg-row-height-compact': '32px',
  '--osdg-row-height-default': '40px',
  '--osdg-row-height-comfortable': '48px',
  '--osdg-header-height': '44px',
  '--osdg-border-color': 'rgb(229 231 235)',
  '--osdg-border-color-dark': 'rgb(55 65 81)',
  '--osdg-bg': 'rgb(255 255 255)',
  '--osdg-bg-dark': 'rgb(17 24 39)',
  '--osdg-bg-header': 'rgb(249 250 251)',
  '--osdg-bg-header-dark': 'rgb(31 41 55)',
  '--osdg-bg-row-hover': 'rgb(243 244 246)',
  '--osdg-bg-row-hover-dark': 'rgb(55 65 81)',
  '--osdg-bg-row-selected': 'rgb(239 246 255)',
  '--osdg-bg-row-selected-dark': 'rgb(30 58 138)',
  '--osdg-text': 'rgb(17 24 39)',
  '--osdg-text-dark': 'rgb(243 244 246)',
  '--osdg-text-muted': 'rgb(107 114 128)',
  '--osdg-accent': 'rgb(59 130 246)',
  '--osdg-accent-hover': 'rgb(37 99 235)',
  '--osdg-focus-ring': 'rgb(59 130 246)',
  '--osdg-cell-padding-x': '12px',
  '--osdg-cell-padding-y': '8px',
  '--osdg-radius': '8px',
  '--osdg-font-size': '14px',
  '--osdg-font-size-compact': '13px',
};

export function osdgPlugin({ addComponents }: { addComponents: (components: Record<string, Record<string, string>>) => void }) {
  addComponents({
    '.osdg-grid': {
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontSize: 'var(--osdg-font-size)',
      color: 'var(--osdg-text)',
      backgroundColor: 'var(--osdg-bg)',
      borderRadius: 'var(--osdg-radius)',
      border: '1px solid var(--osdg-border-color)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    '.osdg-grid--dark': {
      color: 'var(--osdg-text-dark)',
      backgroundColor: 'var(--osdg-bg-dark)',
      borderColor: 'var(--osdg-border-color-dark)',
    },
    '.osdg-toolbar': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      borderBottom: '1px solid var(--osdg-border-color)',
      backgroundColor: 'var(--osdg-bg-header)',
    },
    '.osdg-table-wrapper': {
      overflow: 'auto',
      flex: '1',
      position: 'relative',
    },
    '.osdg-table': {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
    },
    '.osdg-header': {
      position: 'sticky',
      top: '0',
      zIndex: '10',
      backgroundColor: 'var(--osdg-bg-header)',
      borderBottom: '1px solid var(--osdg-border-color)',
    },
    '.osdg-header-cell': {
      padding: 'var(--osdg-cell-padding-y) var(--osdg-cell-padding-x)',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '13px',
      color: 'var(--osdg-text-muted)',
      userSelect: 'none',
      position: 'relative',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '.osdg-header-cell--sortable': {
      cursor: 'pointer',
    },
    '.osdg-header-cell--sortable:hover': {
      backgroundColor: 'var(--osdg-bg-row-hover)',
    },
    '.osdg-row': {
      borderBottom: '1px solid var(--osdg-border-color)',
    },
    '.osdg-row:hover': {
      backgroundColor: 'var(--osdg-bg-row-hover)',
    },
    '.osdg-row--selected': {
      backgroundColor: 'var(--osdg-bg-row-selected)',
    },
    '.osdg-row--group': {
      backgroundColor: 'var(--osdg-bg-header)',
      fontWeight: '600',
    },
    '.osdg-cell': {
      padding: 'var(--osdg-cell-padding-y) var(--osdg-cell-padding-x)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '.osdg-cell--pinned-left': {
      position: 'sticky',
      left: '0',
      zIndex: '5',
      backgroundColor: 'inherit',
    },
    '.osdg-cell--pinned-right': {
      position: 'sticky',
      right: '0',
      zIndex: '5',
      backgroundColor: 'inherit',
    },
    '.osdg-resize-handle': {
      position: 'absolute',
      right: '0',
      top: '0',
      height: '100%',
      width: '4px',
      cursor: 'col-resize',
      userSelect: 'none',
      touchAction: 'none',
    },
    '.osdg-resize-handle:hover': {
      backgroundColor: 'var(--osdg-accent)',
    },
    '.osdg-pagination': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderTop: '1px solid var(--osdg-border-color)',
      fontSize: '13px',
      color: 'var(--osdg-text-muted)',
    },
    '.osdg-btn': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 12px',
      fontSize: '13px',
      fontWeight: '500',
      borderRadius: '6px',
      border: '1px solid var(--osdg-border-color)',
      backgroundColor: 'var(--osdg-bg)',
      color: 'var(--osdg-text)',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
    },
    '.osdg-btn:hover': {
      backgroundColor: 'var(--osdg-bg-row-hover)',
    },
    '.osdg-btn--primary': {
      backgroundColor: 'var(--osdg-accent)',
      color: 'white',
      borderColor: 'var(--osdg-accent)',
    },
    '.osdg-btn--primary:hover': {
      backgroundColor: 'var(--osdg-accent-hover)',
    },
    '.osdg-input': {
      padding: '6px 10px',
      fontSize: '13px',
      borderRadius: '6px',
      border: '1px solid var(--osdg-border-color)',
      backgroundColor: 'var(--osdg-bg)',
      color: 'var(--osdg-text)',
      outline: 'none',
    },
    '.osdg-input:focus': {
      borderColor: 'var(--osdg-focus-ring)',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
    '.osdg-checkbox': {
      width: '16px',
      height: '16px',
      cursor: 'pointer',
      accentColor: 'var(--osdg-accent)',
    },
    '.osdg-density-compact': {
      '--osdg-cell-padding-y': '4px',
      '--osdg-font-size': 'var(--osdg-font-size-compact)',
    },
    '.osdg-density-comfortable': {
      '--osdg-cell-padding-y': '12px',
    },
  });
}

export const osdgPreset: Partial<Config> = {
  theme: {
    extend: {},
  },
  plugins: [osdgPlugin],
};

export default osdgPreset;
