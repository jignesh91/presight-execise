import { User } from '../types';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const displayHobbies = user.hobbies.slice(0, 2);
  const remaining = user.hobbies.length - 2;

  return (
    <div className="group flex gap-3.5 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:border-gray-200 hover:shadow-md sm:gap-4 sm:p-4">
      <img
        src={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
        className="h-11 w-11 flex-shrink-0 rounded-full object-cover ring-2 ring-gray-100 transition-all group-hover:ring-indigo-100 sm:h-12 sm:w-12"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-[15px]">
          {user.first_name} {user.last_name}
        </h3>
        <div className="mt-0.5 flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {user.nationality}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
            {user.age} yrs
          </span>
        </div>
        {displayHobbies.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {displayHobbies.map((hobby) => (
              <span
                key={hobby}
                className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600"
              >
                {hobby}
              </span>
            ))}
            {remaining > 0 && (
              <span className="inline-block rounded-md bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-400">
                +{remaining}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
