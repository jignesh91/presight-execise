# User Directory

A searchable, filterable, paginated user directory built with React, Node.js, and SQLite.

## Features

- Full-text search across first and last name
- Filter by nationalities (OR logic) and hobbies (AND logic)
- Sort by first name, last name, age, or nationality with deterministic pagination
- Cursor-based infinite scroll with virtualized rendering
- Top 20 hobby and nationality counts reflecting all active filters
- URL state sync -- search, filters, sort are persisted in the query string
- Responsive layout with collapsible filter sidebar on mobile

## Tech Stack

- **Client**: React 18, TypeScript, Tailwind CSS, @tanstack/react-query, @tanstack/react-virtual, React Router
- **Server**: Express, TypeScript, better-sqlite3 (raw SQL)
- **Build**: Vite (client), tsx (server dev)
- **Containerization**: Docker, docker-compose

## Prerequisites

- Node.js 20+
- npm 9+
- Docker and Docker Compose (for containerized setup)

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/jignesh91/presight-execise.git
cd presight-execise
```

### 2. Install dependencies

```bash
npm install
```

This installs dependencies for both the client and server workspaces.

### 3. Seed the database

```bash
npm run seed
```

Creates a SQLite database at `server/data/users.db` with 5000 users, 50 hobbies, and randomized user-hobby associations (0-10 hobbies per user, 30 nationalities).

### 4. Start the development servers

```bash
npm run dev
```

This starts both servers concurrently:
- **Client**: http://localhost:3000 (Vite dev server with API proxy to :4000)
- **Server**: http://localhost:4000

The client proxies `/api/*` requests to the server, so all requests go through port 3000 during development.

Open http://localhost:3000 in your browser.

## Running with Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/jignesh91/presight-execise.git
cd presight-execise
```

### 2. Build and start

```bash
docker-compose up --build
```

This builds and starts two containers:
- **client** (port 3000) -- production React build served by nginx, with API proxy to the server container
- **server** (port 4000) -- Node.js API server with SQLite

The database is seeded automatically on the first run if `users.db` does not exist. Data is persisted in a Docker volume (`server-data`).

To stop:

```bash
docker-compose down
```

To reset the database:

```bash
docker-compose down -v
docker-compose up --build
```

## Project Structure

```
presight-exercise/
├── docker-compose.yml
├── Dockerfile.client          # Multi-stage: build with Vite, serve with nginx
├── Dockerfile.server          # Node 20 alpine, auto-seeds on first run
├── package.json               # Workspace root
├── client/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── nginx.conf             # API proxy + SPA fallback
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── types.ts
│       ├── hooks/
│       │   ├── useUsers.ts        # Infinite query hook
│       │   ├── useFilters.ts      # Top-20 filter extraction
│       │   └── useUrlState.ts     # URL <-> filter state sync
│       └── components/
│           ├── Layout.tsx
│           ├── SearchInput.tsx
│           ├── SortControls.tsx
│           ├── FilterSidebar.tsx
│           ├── FilterSection.tsx
│           ├── ActiveFilters.tsx
│           ├── UserCard.tsx
│           ├── UserList.tsx
│           └── states/
│               ├── Loading.tsx
│               ├── Empty.tsx
│               └── Error.tsx
└── server/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts               # Express entry point
        ├── db.ts                  # SQLite connection + schema
        ├── seed.ts                # Seed script
        ├── types.ts
        └── routes/
            └── users.ts           # GET /api/users endpoint
```

## API

### GET /api/users

| Param | Type | Description |
|-------|------|-------------|
| search | string | Text filter on first_name, last_name (LIKE match) |
| nationalities | string | Comma-separated list, OR logic |
| hobbies | string | Comma-separated list, AND logic |
| sort | string | first_name, last_name, age, nationality (default: first_name) |
| order | string | asc or desc (default: asc) |
| cursor | string | Base64-encoded pagination cursor |
| limit | number | Page size, 1-100 (default: 20) |

### Response

```json
{
  "users": [
    {
      "id": 1,
      "avatar": "https://i.pravatar.cc/150?u=1",
      "first_name": "Alice",
      "last_name": "Smith",
      "age": 32,
      "nationality": "American",
      "hobbies": ["Reading", "Hiking"]
    }
  ],
  "nextCursor": "eyJ2IjoiQWxpY2UiLCJpZCI6MX0",
  "hasMore": true,
  "topHobbies": [{ "value": "Reading", "count": 342 }],
  "topNationalities": [{ "value": "American", "count": 158 }]
}
```
