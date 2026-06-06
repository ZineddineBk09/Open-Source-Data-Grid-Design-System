import { generateEmployees, type Employee } from './sampleData';

const allData = generateEmployees(10000);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ServerQuery {
  pageIndex: number;
  pageSize: number;
  sorting: { id: string; desc: boolean }[];
  globalFilter: string;
  columnFilters: { id: string; operator: string; value: unknown }[];
}

export interface ServerResponse {
  rows: Employee[];
  pageCount: number;
  rowCount: number;
}

export async function fetchServerData(query: ServerQuery): Promise<ServerResponse> {
  await delay(400 + Math.random() * 300);

  let rows = [...allData];

  if (query.globalFilter.trim()) {
    const q = query.globalFilter.toLowerCase();
    rows = rows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }

  for (const f of query.columnFilters) {
    if (!f.value) continue;
    rows = rows.filter((r) => {
      const val = r[f.id as keyof Employee];
      const str = String(val ?? '').toLowerCase();
      const filter = String(f.value).toLowerCase();
      if (f.operator === 'contains') return str.includes(filter);
      if (f.operator === 'equals') return str === filter;
      if (f.operator === 'gt') return Number(val) > Number(f.value);
      if (f.operator === 'lt') return Number(val) < Number(f.value);
      return true;
    });
  }

  for (const sort of query.sorting) {
    rows.sort((a, b) => {
      const av = a[sort.id as keyof Employee];
      const bv = b[sort.id as keyof Employee];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.desc ? -cmp : cmp;
    });
  }

  const rowCount = rows.length;
  const pageCount = Math.max(1, Math.ceil(rowCount / query.pageSize));
  const start = query.pageIndex * query.pageSize;
  const page = rows.slice(start, start + query.pageSize);

  return { rows: page, pageCount, rowCount };
}
