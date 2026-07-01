import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { User, UsersResponse, FilterCount } from '../types';

const router = Router();

interface UserRow {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
}

const VALID_SORT_FIELDS = ['first_name', 'last_name', 'age', 'nationality'] as const;
type SortField = typeof VALID_SORT_FIELDS[number];

function encodeCursor(sortValue: string | number, id: number): string {
  return Buffer.from(JSON.stringify({ v: sortValue, id })).toString('base64url');
}

function decodeCursor(cursor: string): { v: string | number; id: number } | null {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString());
  } catch {
    return null;
  }
}

router.get('/', (req: Request, res: Response) => {
  const db = getDb();

  const search = (req.query.search as string || '').trim();
  const nationalities = (req.query.nationalities as string || '').split(',').filter(Boolean);
  const hobbies = (req.query.hobbies as string || '').split(',').filter(Boolean);
  const sortField = VALID_SORT_FIELDS.includes(req.query.sort as SortField)
    ? (req.query.sort as SortField)
    : 'first_name';
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
  const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
  const cursor = req.query.cursor as string || '';

  // Build base WHERE conditions
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (search) {
    conditions.push('(u.first_name LIKE ? OR u.last_name LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (nationalities.length > 0) {
    conditions.push(`u.nationality IN (${nationalities.map(() => '?').join(',')})`);
    params.push(...nationalities);
  }

  // Hobby filter: AND logic -- user must have ALL selected hobbies
  let hobbyJoin = '';
  let hobbyHaving = '';
  if (hobbies.length > 0) {
    hobbyJoin = `
      INNER JOIN user_hobbies uh_filter ON uh_filter.user_id = u.id
      INNER JOIN hobbies h_filter ON h_filter.id = uh_filter.hobby_id
        AND h_filter.name IN (${hobbies.map(() => '?').join(',')})
    `;
    hobbyHaving = `HAVING COUNT(DISTINCT h_filter.name) = ?`;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Build the filtered user IDs CTE
  const hobbyParams = hobbies.length > 0 ? [...hobbies, hobbies.length] : [];
  const filteredCte = `
    filtered_users AS (
      SELECT u.id
      FROM users u
      ${hobbyJoin}
      ${whereClause}
      GROUP BY u.id
      ${hobbyHaving}
    )
  `;
  // Build params in SQL clause order: hobby join, WHERE, HAVING
  const filteredParams: (string | number)[] = [];
  if (hobbies.length > 0) {
    filteredParams.push(...hobbies); // for h_filter.name IN (...)
  }
  filteredParams.push(...params); // for WHERE conditions
  if (hobbies.length > 0) {
    filteredParams.push(hobbies.length); // for HAVING COUNT = ?
  }

  // Cursor pagination
  let cursorCondition = '';
  const cursorParams: (string | number)[] = [];
  if (cursor) {
    const decoded = decodeCursor(cursor);
    if (decoded) {
      const op = order === 'ASC' ? '>' : '<';
      cursorCondition = `AND (u.${sortField} ${op} ? OR (u.${sortField} = ? AND u.id ${op} ?))`;
      cursorParams.push(decoded.v, decoded.v, decoded.id);
    }
  }

  // Main query: fetch users
  const mainQuery = `
    WITH ${filteredCte}
    SELECT u.id, u.avatar, u.first_name, u.last_name, u.age, u.nationality
    FROM users u
    INNER JOIN filtered_users fu ON fu.id = u.id
    WHERE 1=1 ${cursorCondition}
    ORDER BY u.${sortField} ${order}, u.id ${order}
    LIMIT ?
  `;

  const mainParams = [...filteredParams, ...cursorParams, limit + 1];
  const rows = db.prepare(mainQuery).all(...mainParams) as UserRow[];

  const hasMore = rows.length > limit;
  const users = rows.slice(0, limit);

  // Attach hobbies to each user
  const hobbyMap = new Map<number, string[]>();
  if (users.length > 0) {
    const userIds = users.map(u => u.id);
    const placeholders = userIds.map(() => '?').join(',');
    const hobbyRows = db.prepare(`
      SELECT uh.user_id, h.name
      FROM user_hobbies uh
      INNER JOIN hobbies h ON h.id = uh.hobby_id
      WHERE uh.user_id IN (${placeholders})
      ORDER BY h.name
    `).all(...userIds) as { user_id: number; name: string }[];

    for (const row of hobbyRows) {
      if (!hobbyMap.has(row.user_id)) hobbyMap.set(row.user_id, []);
      hobbyMap.get(row.user_id)!.push(row.name);
    }
  }

  const usersWithHobbies: User[] = users.map(u => ({
    ...u,
    hobbies: hobbyMap.get(u.id) || [],
  }));

  // Next cursor
  let nextCursor: string | null = null;
  if (hasMore && users.length > 0) {
    const lastUser = users[users.length - 1];
    nextCursor = encodeCursor(lastUser[sortField], lastUser.id);
  }

  // Top 20 hobbies (count users matching all filters)
  const topHobbiesQuery = `
    WITH ${filteredCte}
    SELECT h.name as value, COUNT(DISTINCT uh.user_id) as count
    FROM hobbies h
    INNER JOIN user_hobbies uh ON uh.hobby_id = h.id
    INNER JOIN filtered_users fu ON fu.id = uh.user_id
    GROUP BY h.id, h.name
    ORDER BY count DESC, h.name ASC
    LIMIT 20
  `;
  const topHobbies = db.prepare(topHobbiesQuery).all(...filteredParams) as FilterCount[];

  // Top 20 nationalities (count users matching all filters)
  const topNationalitiesQuery = `
    WITH ${filteredCte}
    SELECT u.nationality as value, COUNT(*) as count
    FROM users u
    INNER JOIN filtered_users fu ON fu.id = u.id
    GROUP BY u.nationality
    ORDER BY count DESC, u.nationality ASC
    LIMIT 20
  `;
  const topNationalities = db.prepare(topNationalitiesQuery).all(...filteredParams) as FilterCount[];

  const response: UsersResponse = {
    users: usersWithHobbies,
    nextCursor,
    hasMore,
    topHobbies,
    topNationalities,
  };

  res.json(response);
});

export default router;
