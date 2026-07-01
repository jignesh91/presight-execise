export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface FilterCount {
  value: string;
  count: number;
}

export interface UsersResponse {
  users: User[];
  nextCursor: string | null;
  hasMore: boolean;
  topHobbies: FilterCount[];
  topNationalities: FilterCount[];
}

export interface FilterState {
  search: string;
  nationalities: string[];
  hobbies: string[];
  sort: string;
  order: 'asc' | 'desc';
}
