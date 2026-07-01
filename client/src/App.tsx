import { useMemo } from 'react';
import { useUrlState } from './hooks/useUrlState';
import { useUsers } from './hooks/useUsers';
import { useFilters } from './hooks/useFilters';
import { Layout } from './components/Layout';
import { SearchInput } from './components/SearchInput';
import { SortControls } from './components/SortControls';
import { FilterSidebar } from './components/FilterSidebar';
import { ActiveFilters } from './components/ActiveFilters';
import { UserList } from './components/UserList';
import { Loading } from './components/states/Loading';
import { Empty } from './components/states/Empty';
import { ErrorState } from './components/states/Error';

export default function App() {
  const { state, setState } = useUrlState();
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsers(state);
  const { topHobbies, topNationalities } = useFilters(data);

  const allUsers = useMemo(
    () => data?.pages.flatMap((page) => page.users) || [],
    [data?.pages]
  );

  const filterCount = state.hobbies.length + state.nationalities.length;

  const sidebar = (
    <FilterSidebar
      topHobbies={topHobbies}
      topNationalities={topNationalities}
      selectedHobbies={state.hobbies}
      selectedNationalities={state.nationalities}
      onHobbiesChange={(hobbies) => setState({ hobbies })}
      onNationalitiesChange={(nationalities) => setState({ nationalities })}
      onClearAll={() => setState({ hobbies: [], nationalities: [] })}
    />
  );

  return (
    <Layout sidebar={sidebar} filterCount={filterCount}>
      <div className="mb-3 flex flex-shrink-0 flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput value={state.search} onChange={(search) => setState({ search })} />
        </div>
        <SortControls
          sort={state.sort}
          order={state.order}
          onSortChange={(sort) => setState({ sort })}
          onOrderChange={(order) => setState({ order })}
        />
      </div>

      {(state.search || state.hobbies.length > 0 || state.nationalities.length > 0) && (
        <div className="mb-3 flex-shrink-0">
          <ActiveFilters
            search={state.search}
            hobbies={state.hobbies}
            nationalities={state.nationalities}
            onRemoveSearch={() => setState({ search: '' })}
            onRemoveHobby={(h) => setState({ hobbies: state.hobbies.filter((x) => x !== h) })}
            onRemoveNationality={(n) => setState({ nationalities: state.nationalities.filter((x) => x !== n) })}
            onClearAll={() => setState({ search: '', hobbies: [], nationalities: [] })}
          />
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : allUsers.length === 0 ? (
        <Empty />
      ) : (
        <UserList
          users={allUsers}
          totalLoaded={allUsers.length}
          hasMore={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </Layout>
  );
}
