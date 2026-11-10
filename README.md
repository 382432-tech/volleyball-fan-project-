# Spike Hub - Volleyball Fan Project

A comprehensive volleyball fan application for player stats, comparisons, and custom lineup building.

## Features

### 5 Core Views
- **Home Dashboard** - Landing page with Daily Fun Fact
- **Player Directory** - Searchable/filterable player list
- **Player Detail** - Individual player profiles with expandable sections
- **Head-to-Head Comparison** - Side-by-side player comparison
- **Lineup Builder** - Create and save custom 6-player rotations

### 10 Custom Features
1. Search Bar
2. Category Filters (Position)
3. Sorting Options
4. Favorites Button
5. Dark/Light Mode
6. Comparison Tool
7. Personal Notes
8. Expandable Information Sections
9. Daily Fun Fact
10. CSV Export

## Tech Stack
- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Authentication)
- **Deployment:** Vercel

## Setup Instructions

### 1. Create Supabase Project
1. Go to [Supabase](https://app.supabase.com/) and create a new project
2. Note your Project URL and Anon Key from Settings > API

### 2. Run Database Schema
1. Go to your Supabase project > SQL Editor
2. Run the schema from `database/schema.sql`
3. This creates tables and seeds 8 volleyball players

### 3. Configure Environment Variables
Create a `.env.local` file in the root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel
1. Push to GitHub
2. Go to [Vercel](https://vercel.com/) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── app/
│   ├── compare/          # Head-to-Head Comparison (View 4)
│   ├── lineup-builder/   # Custom Lineup Builder (View 5)
│   ├── login/            # Authentication
│   ├── signup/           # Authentication
│   ├── players/
│   │   └── [id]/         # Player Detail (View 3)
│   ├── globals.css       # Theme colors
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Home Dashboard (View 1)
├── components/
│   ├── DailyFunFact.tsx  # Feature #33
│   └── Navbar.tsx        # Navigation with theme toggle
├── context/
│   ├── AuthContext.tsx   # Supabase Authentication
│   └── ThemeContext.tsx  # Dark/Light Mode (Feature #9)
├── data/
│   └── mockPlayers.ts    # Development mock data
├── lib/
│   └── supabase/
│       └── client.ts     # Supabase client
└── types/
    └── database.ts      # TypeScript types

database/
└── schema.sql           # Supabase database schema
```

## Database Schema

The database includes:
- **players** table: Read-only volleyball player data
- **lineups** table: User-created lineups with 6 players
- **Row Level Security:** Users can only access their own lineups

See `database/schema.sql` for full schema.

## Authentication

- Sign Up: `/signup`
- Sign In: `/login`
- Sign Out: Available in navbar when logged in
- Protected Routes: Lineup Builder requires authentication

## Color Theme

- **Court Blue:** #0F4C81
- **Spike Gold:** #FFB800

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push and create a pull request

## License

MIT
