# Spike Hub - Complete Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Supabase Project
1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Click "New Project"
3. Enter project name: `spike-hub`
4. Select region (choose closest to you)
5. Click "Create Project"
6. **Wait 2-3 minutes** for project to initialize

### Step 2: Get Your API Keys
1. In your Supabase dashboard, click **Project Settings** (gear icon)
2. Go to **API** tab
3. Copy:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Run Database Schema
1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy all content from `database/schema.sql` in this repo
4. Click **Run**
5. Verify: You should see 8 players in the `players` table

### Step 4: Configure Environment Variables
Create a `.env.local` file in your project root:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-from-step-2
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-step-2
```

### Step 5: Test Locally
```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and try:
- Sign up with email/password
- Browse players
- Create a lineup
- Export to CSV

### Step 6: Deploy to Vercel
1. Push all changes to GitHub
2. Go to [https://vercel.com/](https://vercel.com/)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Add environment variables (same as `.env.local`)
6. Click "Deploy"
7. **Wait 2-3 minutes** for deployment

---

## Detailed Setup Instructions

### Supabase Configuration

#### Enable Email Authentication
1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Under **Redirect URLs**, add:
   - `http://localhost:3000` (for development)
   - Your Vercel deployment URL (for production)
4. Click **Save**

#### Test Database Connection
1. In Supabase SQL Editor, run:
   ```sql
   SELECT * FROM players;
   ```
2. You should see 8 volleyball players

#### Verify RLS Policies
1. In SQL Editor, run:
   ```sql
   SELECT * FROM lineups;
   ```
2. This should return an empty array (RLS is working - no lineups yet)

### Environment Variables

#### For Development (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### For Vercel Production
1. In Vercel dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add both variables with the same values

### Deployment Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Email authentication enabled
- [ ] Redirect URLs added to Supabase
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Deployment successful

---

## Troubleshooting

### "Failed to load players"
- Check if Supabase URL and key are correct in `.env.local`
- Verify you ran the schema in Supabase SQL Editor
- Check browser console for errors

### "Cannot read properties of undefined (reading 'id')"
- This means Supabase connection failed
- Verify environment variables are loaded
- Restart your development server after changing `.env.local`

### "User not authenticated"
- Make sure you enabled Email provider in Supabase Auth
- Check redirect URLs in Supabase Auth settings
- Verify you're using the correct Supabase URL

### "403 Forbidden on lineups table"
- RLS policies are working correctly
- Make sure you're logged in before accessing lineups
- Verify your user ID matches the lineup's user_id

---

## Common Issues & Fixes

### Issue: Supabase queries return empty arrays
**Fix:** Run the schema.sql file in Supabase SQL Editor

### Issue: Authentication redirects to localhost
**Fix:** Add your production URL to Supabase Auth Redirect URLs

### Issue: Lineups not saving
**Fix:** 
1. Check browser console for errors
2. Verify you're logged in (check navbar)
3. Verify Supabase URL is correct

### Issue: Images not loading
**Fix:** The mock data uses Unsplash URLs. If you want to use your own images, update the `image_url` field in the database or mock data.

---

## Next Steps After Deployment

1. **Test all features** on the live site
2. **Create a test user** and verify lineups persist
3. **Share with friends** for feedback
4. **Monitor Supabase dashboard** for errors
5. **Set up database backups** in Supabase

---

## Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Issues:** Create an issue in your repository

---

## Project Structure Reference

```
src/
├── app/
│   ├── compare/          # Head-to-Head Comparison
│   ├── lineup-builder/   # Lineup Builder (requires auth)
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── players/
│   │   └── [id]/         # Player Detail
│   ├── globals.css       # Theme colors
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home Dashboard
├── components/
│   ├── DailyFunFact.tsx
│   └── Navbar.tsx
├── context/
│   ├── AuthContext.tsx   # User authentication
│   └── ThemeContext.tsx  # Dark/Light mode
├── lib/
│   └── supabase/
│       ├── client.ts     # Supabase client
│       └── queries.ts    # Database queries
└── types/
    └── database.ts      # TypeScript types

database/
└── schema.sql           # Supabase schema
```
