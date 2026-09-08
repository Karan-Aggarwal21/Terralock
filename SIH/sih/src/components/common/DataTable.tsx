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
      <div className="py-16 text-center text-xs font-mono text-[#64748b] bg-white rounded-2xl border border-[#e2e8e4]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto bg-white rounded-2xl border border-[#e2e8e4] shadow-xs ${className}`}>
      <table className="w-full text-left text-xs text-[#374151] font-sans">
        <thead className="bg-[#f8faf9] text-[#64748b] uppercase font-mono font-semibold text-[11px] border-b border-[#e2e8e4] tracking-wider">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-4 px-6 ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f3]">
          {data.map((item) => {
            const key = keyExtractor(item);
            const isSelected = selectedKey === key;
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(item)}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[#f8faf9]' : ''
                  } ${isSelected ? 'bg-[#edf7f1]/50 font-medium' : ''}`}
              >
                {columns.map((col, idx) => (
                  <td
                    key={col.key}
                    className={`py-4 px-6 text-[#111827] ${isSelected && idx === 0 ? 'border-l-4 border-[#244d3b]' : ''
                      } ${col.className || ''}`}
                  >
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
