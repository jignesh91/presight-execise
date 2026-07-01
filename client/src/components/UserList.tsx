import { useRef, useCallback, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { User } from '../types';
import { UserCard } from './UserCard';

interface UserListProps {
  users: User[];
  totalLoaded: number;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function UserList({ users, totalLoaded, hasMore, isFetchingNextPage, fetchNextPage }: UserListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 10,
  });

  const items = virtualizer.getVirtualItems();

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el || isFetchingNextPage || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 300) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasMore, isFetchingNextPage]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400">
          Showing {totalLoaded.toLocaleString()} users{hasMore ? '+' : ''}
        </p>
        {isFetchingNextPage && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-500">
            <div className="h-3 w-3 animate-spin rounded-full border-[2px] border-indigo-200 border-t-indigo-500" />
            Loading more...
          </div>
        )}
      </div>
      <div ref={parentRef} className="flex-1 overflow-y-auto rounded-xl">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {items.map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="pb-2">
                <UserCard user={users[virtualItem.index]} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
