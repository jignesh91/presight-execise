interface ActiveFiltersProps {
  search: string;
  hobbies: string[];
  nationalities: string[];
  onRemoveSearch: () => void;
  onRemoveHobby: (hobby: string) => void;
  onRemoveNationality: (nationality: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  search,
  hobbies,
  nationalities,
  onRemoveSearch,
  onRemoveHobby,
  onRemoveNationality,
  onClearAll,
}: ActiveFiltersProps) {
  const hasAny = search || hobbies.length > 0 || nationalities.length > 0;
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {search && (
        <Chip label={`"${search}"`} onRemove={onRemoveSearch} color="gray" />
      )}
      {nationalities.map((n) => (
        <Chip key={n} label={n} onRemove={() => onRemoveNationality(n)} color="emerald" />
      ))}
      {hobbies.map((h) => (
        <Chip key={h} label={h} onRemove={() => onRemoveHobby(h)} color="indigo" />
      ))}
      <button
        onClick={onClearAll}
        className="ml-1 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
      >
        Clear all
      </button>
    </div>
  );
}

function Chip({ label, onRemove, color }: { label: string; onRemove: () => void; color: 'gray' | 'indigo' | 'emerald' }) {
  const styles = {
    gray: 'bg-gray-100 text-gray-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${styles[color]}`}>
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
