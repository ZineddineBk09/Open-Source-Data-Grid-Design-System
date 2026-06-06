import { StrictMode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DataGrid } from '@zineddinebk09/grid-react';
import '@zineddinebk09/grid-react/styles.css';
import { generateEmployees, employeeColumns } from './data';
import './demo.css';

const REPO = 'Open-Source-Data-Grid-Design-System';
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const DEMO_URL = `${BASE}/`;
const STORYBOOK_URL = `${BASE}/storybook/`;
const GITHUB_URL = `https://github.com/ZineddineBk09/${REPO}`;

const screenshots = [
  { src: `${BASE}/screenshots/grid-light.png`, alt: 'Grid in light mode with sorting', caption: 'Light mode + sort' },
  { src: `${BASE}/screenshots/grid-dark.png`, alt: 'Grid in dark mode with row selection', caption: 'Dark mode + selection' },
  { src: `${BASE}/screenshots/column-filters.png`, alt: 'Per-column filter bar with active filters', caption: 'Column filters' },
  { src: `${BASE}/screenshots/virtual-scroll.png`, alt: 'Virtual scroll with 100k rows', caption: 'Virtual scroll (100k rows)' },
  { src: `${BASE}/screenshots/pinned-column.png`, alt: 'Sticky pinned columns', caption: 'Column pinning' },
  { src: `${BASE}/screenshots/expandable-hierarchy.png`, alt: 'Expandable tree data rows', caption: 'Tree data' },
];

const employees = generateEmployees(5000);

const features = [
  { title: 'Virtual scrolling', desc: '100k+ rows with @tanstack/virtual — only visible DOM nodes rendered.' },
  { title: 'Column filters', desc: 'Per-column operators (contains, equals, gt/lt) plus global search.' },
  { title: 'Tree data', desc: 'Expandable nested rows for org charts, file trees, and hierarchies.' },
  { title: 'Inline editing', desc: 'Double-click to edit with undo/redo (Ctrl+Z / Ctrl+Shift+Z).' },
  { title: 'Column pinning', desc: 'Sticky left/right columns with shadow cues at scroll edges.' },
  { title: 'Server-side mode', desc: 'Manual pagination, sorting, and filtering with loading states.' },
];

function App() {
  const [data, setData] = useState(employees);
  const [dark, setDark] = useState(false);
  const [selection, setSelection] = useState<Record<string, boolean>>({});

  const handleCellEdit = useCallback((rowId: string, columnId: string, value: unknown) => {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row)),
    );
  }, []);

  const selectedCount = Object.values(selection).filter(Boolean).length;

  return (
    <div className={`demo-page ${dark ? 'demo--dark' : ''}`}>
      <nav className="demo-nav">
        <a href={DEMO_URL} className="demo-nav__brand">
          OSDG Grid
        </a>
        <div className="demo-nav__links">
          <a href={STORYBOOK_URL}>Storybook</a>
          <a href={`${GITHUB_URL}#readme`} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            MIT
          </a>
          <button type="button" className="demo-btn" onClick={() => setDark((d) => !d)}>
            {dark ? '☀ Light' : '🌙 Dark'}
          </button>
        </div>
      </nav>

      <header className="demo-hero">
        <p className="demo-hero__eyebrow">React · Vue · TypeScript</p>
        <h1>Enterprise data grid,<br />open source</h1>
        <p>
          Headless core with React &amp; Vue adapters. Virtual scroll, sort, filter, group, pin,
          tree data, edit, and export — built for real app workloads.
        </p>
        <div className="demo-hero__actions">
          <a className="demo-btn demo-btn--primary" href="#live-demo">
            Try live demo
          </a>
          <a className="demo-btn" href={STORYBOOK_URL}>
            Component docs
          </a>
          <a className="demo-btn" href={GITHUB_URL} target="_blank" rel="noreferrer">
            View source
          </a>
        </div>
        <div className="demo-hero__screenshots">
          {screenshots.map((shot) => (
            <figure key={shot.caption} className="demo-screenshot">
              <img src={shot.src} alt={shot.alt} loading="lazy" />
              <figcaption>{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </header>

      <section className="demo-section">
        <h2>Built for real workloads</h2>
        <p>Everything you'd expect from an internal design-system grid — without the vendor lock-in.</p>
        <div className="demo-features">
          {features.map((f) => (
            <article key={f.title} className="demo-feature">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="live-demo" className="demo-grid-section">
        <div className="demo-section">
          <h2>Live demo</h2>
          <p>
            {data.length.toLocaleString()} rows · Column filters, sorting, selection, inline edit
            (double-click), undo/redo, CSV export. Toggle dark mode in the nav.
          </p>
          <div className="demo-grid-toolbar">
            {selectedCount > 0 && (
              <span className="demo-selection-count">
                {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          <DataGrid
            data={data}
            columns={employeeColumns}
            getRowId={(row) => row.id}
            enableRowSelection
            enableGrouping
            enableColumnResizing
            enableGlobalFilter
            showColumnFilters
            dark={dark}
            height={560}
            onCellEdit={handleCellEdit}
            onRowSelectionChange={setSelection}
          />
        </div>
      </section>

      <footer className="demo-footer">
        <p>
          <a href={GITHUB_URL}>Open-Source Data Grid Design System</a>
          {' · '}
          <a href={STORYBOOK_URL}>Storybook</a>
          {' · '}
          MIT License
        </p>
        <p className="demo-footer__meta">@zineddinebk09/grid-react · pnpm · Turborepo · Vitest · Playwright</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
