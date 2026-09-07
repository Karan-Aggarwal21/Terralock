import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedKey?: string | null;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  selectedKey,
  emptyMessage = 'No records available.',
  className = '',
}: DataTableProps<T>): React.ReactElement {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-xs font-mono text-slate-500 dark:text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-mono font-semibold text-[11px] border-b border-slate-200 dark:border-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3.5 px-4 ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.map((item) => {
            const key = keyExtractor(item);
            const isSelected = selectedKey === key;
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(item)}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''
                } ${isSelected ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3.5 px-4 ${col.className || ''}`}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
