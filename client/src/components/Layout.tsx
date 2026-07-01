import { ReactNode, useState } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  filterCount: number;
}

export function Layout({ sidebar, children, filterCount }: LayoutProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <header className="flex-shrink-0 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 sm:text-xl">User Directory</h1>
              <p className="hidden text-xs text-gray-500 sm:block">Browse and filter the team</p>
            </div>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="relative inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors lg:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {filterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {filterCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 py-5 sm:px-6 lg:flex-row lg:gap-6 lg:px-8">
        <div
          className={`flex-shrink-0 overflow-x-hidden overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:block lg:w-72 ${
            filtersOpen ? 'mb-4 max-h-80' : 'hidden'
          }`}
        >
          {sidebar}
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
