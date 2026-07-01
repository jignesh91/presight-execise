import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { FilterState } from '../types';

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const state: FilterState = useMemo(() => ({
    search: searchParams.get('search') || '',
    nationalities: searchParams.get('nationalities')?.split(',').filter(Boolean) || [],
    hobbies: searchParams.get('hobbies')?.split(',').filter(Boolean) || [],
    sort: searchParams.get('sort') || 'first_name',
    order: searchParams.get('order') === 'desc' ? 'desc' : 'asc',
  }), [searchParams]);

  const setState = useCallback((updates: Partial<FilterState>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);

      if ('search' in updates) {
        if (updates.search) next.set('search', updates.search);
        else next.delete('search');
      }
      if ('nationalities' in updates) {
        if (updates.nationalities?.length) next.set('nationalities', updates.nationalities.join(','));
        else next.delete('nationalities');
      }
      if ('hobbies' in updates) {
        if (updates.hobbies?.length) next.set('hobbies', updates.hobbies.join(','));
        else next.delete('hobbies');
      }
      if ('sort' in updates) {
        if (updates.sort && updates.sort !== 'first_name') next.set('sort', updates.sort);
        else next.delete('sort');
      }
      if ('order' in updates) {
        if (updates.order === 'desc') next.set('order', 'desc');
        else next.delete('order');
      }

      return next;
    }, { replace: true });
  }, [setSearchParams]);

  return { state, setState };
}
