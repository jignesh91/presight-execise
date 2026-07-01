import { FilterCount } from '../types';

interface FilterSectionProps {
  title: string;
  items: FilterCount[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function FilterSection({ title, items, selected, onChange }: FilterSectionProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div>
      <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
        {selected.length > 0 && (
          <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
            {selected.length}
          </span>
        )}
      </h3>
      {items.length === 0 && (
        <p className="text-xs text-gray-400 italic">No options available</p>
      )}
      <div className="space-y-0.5 max-h-56 overflow-y-auto overflow-x-hidden pr-1">
        {items.map((item) => {
          const isSelected = selected.includes(item.value);
          return (
            <label
              key={item.value}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                isSelected
                  ? 'bg-indigo-50 text-indigo-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(item.value)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex-1 truncate text-[13px]">{item.value}</span>
              <span className={`text-[11px] font-medium tabular-nums ${
                isSelected ? 'text-indigo-500' : 'text-gray-400'
              }`}>
                {item.count}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
