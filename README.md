# Travel Tracker

A web application built with **Next.js**, **Supabase**, and **ShadCN UI** and deployed with **Vercel**, designed to track travel destinations. Users can mark countries and states as visited, see a map of their visits, and get an idea of how many states, countries, and continents they have left to visit.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) with [ShadCN UI](https://ui.shadcn.com/) and [Lucide Icons](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Icons**: Lucide
- **Deployment**: [Vercel](https://vercel.com/)

---

## Database Schema

```sql
create table public.countries (
  country_id character varying(2) not null,
  country_name character varying(100) not null,
  continent character varying(13) not null,
  constraint countries_pkey primary key (country_id)
) TABLESPACE pg_default;

create table public.countries_visited (
  user_id character varying(100) not null,
  country_id character varying(2) not null,
  visited boolean not null default false,
  only_airport boolean not null default false,
  constraint countries_visited_pkey primary key (user_id, country_id)
) TABLESPACE pg_default;

create table public.states_visited (
  user_id character varying(100) not null,
  state_id character varying(3) not null,
  visited boolean not null default false,
  only_airport boolean not null default false,
  constraint states_visited_pkey primary key (user_id, state_id)
) TABLESPACE pg_default;

create table public.us_states (
  state_id character varying(3) not null,
  state_name character varying(16) not null,
  state_kpi_exception boolean not null,
  constraint us_states_pkey primary key (state_id)
) TABLESPACE pg_default;

create table public.national_parks_visited (
  user_id character varying(100) not null,
  park_id character varying(4) not null,
  visited boolean not null default false,
  constraint parks_visited_pkey primary key (user_id, park_id)
) TABLESPACE pg_default;

create table public.us_national_parks (
  park_id character varying(4) not null,
  park_name character varying(255) null,
  constraint us_national_parks_pk primary key (park_id)
) TABLESPACE pg_default;
```

---

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── [location]/route.ts   # GET, PUT visits
│   │   │   |   └──  kpi/route.ts     # GET counts of visited and not visited states, countries, continents, and national parks
|   |   ├── auth/                     # Pages for performing auth actions (change password, login, etc.)
│   │   ├── page.tsx                  # The only page in the app
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
|   |   ├── auth/                     # Auth components used in auth pages
│   │   ├── shared/                   # Custom reusable components
|   |   |   └── map/                  # Maps of the USA and the world
│   │   └── ui/                       # ShadCN components
│   ├── lib/
|   |   ├── supabase                  # Supabase client, server, and middleware utilities
│   │   ├── constants.ts
│   │   └── utils.ts
│   └── types/  
├── supabase/
│   ├── migrations/
│   │   ├── README.md
│   │   └── 20260214153533_remote_schema.sql # Baseline checkin of supabase schema
├── package.json
├── pnpm-lock.yaml
└── README.md                    
```

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/project-name.git
   cd project-name
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open the app in your browser**
   http://localhost:3000

---

## API Routes

| Route                       | Method | Description                                                                      |
|-----------------------------|--------|----------------------------------------------------------------------------------|                        
| `/api/[location]`           | GET    | Fetch visit data for states and countries                                        |
| `/api/[location]`           | PUT    | Add or update if a state or country has been visited                             |
| `/api/[location]/kpi`       | GET    | Fetch breakdown of number of states/countries/continents visited or not visited  |

---

## Assets

- Generic icons are stored directly in `/public`
- Assets are used in UI components like dropdowns and cards

---

## Linting

Currently, there are no pre-commit hooks for linting in this repository. Instead, follow the below instructions to clean files before committing.

### TypeScript

This repository uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, and `.md` files and keeping formatting consistent.

1. Check for issues:

```bash
pnpm run lint
```

2. Fix these issues:

```bash
pnpm run lint:fix
```

3. Format files with Prettier:

```bash
pnpm run format
```

### SQL

This repository uses [SQLFluff](https://www.sqlfluff.com/) for linting `.sql` files. 

First, make sure that sqlfluff is installed:

```bash
pip install sqlfluff
```

Before committing any SQL changes, run the following and make sure no fixable errors remain:

```bash
sqlfluff lint path/to/sql
sqlfluff fix path/to/sql
```

> Only lint new SQL migrations files. Linting and recommitting previous SQL files that are already a part of the migrations history should be avoided.

---

## Notes

- The app is built using the **App Router** in Next.js (`/src/app`)
- Currently functions as a single-page dashboard (`page.tsx`)
- Uses modular API routes for fetching and updating visit data
- The database table has a composite primary key to ensure uniqueness