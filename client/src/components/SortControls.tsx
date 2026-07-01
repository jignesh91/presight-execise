interface SortControlsProps {
  sort: string;
  order: 'asc' | 'desc';
  onSortChange: (sort: string) => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
}

const SORT_OPTIONS = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'age', label: 'Age' },
  { value: 'nationality', label: 'Nationality' },
];

export function SortControls({ sort, order, onSortChange, onOrderChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="hidden text-xs font-medium text-gray-500 sm:block">Sort by</label>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => onOrderChange(order === 'asc' ? 'desc' : 'asc')}
        className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition-all hover:bg-gray-50 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        title={order === 'asc' ? 'Ascending' : 'Descending'}
      >
        {order === 'asc' ? (
          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        )}
      </button>
    </div>
  );
}
