import { useMemo } from 'react';
import { UsersResponse, FilterCount } from '../types';
import { InfiniteData } from '@tanstack/react-query';

export function useFilters(data: InfiniteData<UsersResponse> | undefined) {
  return useMemo(() => {
    const firstPage = data?.pages[0];
    return {
      topHobbies: firstPage?.topHobbies || [] as FilterCount[],
      topNationalities: firstPage?.topNationalities || [] as FilterCount[],
    };
  }, [data]);
}
