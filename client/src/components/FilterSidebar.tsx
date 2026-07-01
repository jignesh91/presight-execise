import { FilterCount } from '../types';
import { FilterSection } from './FilterSection';

interface FilterSidebarProps {
  topHobbies: FilterCount[];
  topNationalities: FilterCount[];
  selectedHobbies: string[];
  selectedNationalities: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  onNationalitiesChange: (nationalities: string[]) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  topHobbies,
  topNationalities,
  selectedHobbies,
  selectedNationalities,
  onHobbiesChange,
  onNationalitiesChange,
  onClearAll,
}: FilterSidebarProps) {
  const hasFilters = selectedHobbies.length > 0 || selectedNationalities.length > 0;

  return (
    <aside className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
        </div>
        {hasFilters && (
          <button
            onClick={() => onClearAll()}
            className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="h-px bg-gray-100" />

      <FilterSection
        title="Nationalities"
        items={topNationalities}
        selected={selectedNationalities}
        onChange={onNationalitiesChange}
      />

      <div className="h-px bg-gray-100" />

      <FilterSection
        title="Hobbies"
        items={topHobbies}
        selected={selectedHobbies}
        onChange={onHobbiesChange}
      />
    </aside>
  );
}
