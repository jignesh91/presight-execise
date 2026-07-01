import { useInfiniteQuery } from '@tanstack/react-query';
import { FilterState, UsersResponse } from '../types';

async function fetchUsers(filters: FilterState, cursor?: string): Promise<UsersResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.nationalities.length) params.set('nationalities', filters.nationalities.join(','));
  if (filters.hobbies.length) params.set('hobbies', filters.hobbies.join(','));
  params.set('sort', filters.sort);
  params.set('order', filters.order);
  params.set('limit', '20');
  if (cursor) params.set('cursor', cursor);

  const res = await fetch(`/api/users?${params}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export function useUsers(filters: FilterState) {
  return useInfiniteQuery({
    queryKey: ['users', filters],
    queryFn: ({ pageParam }) => fetchUsers(filters, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });
}
