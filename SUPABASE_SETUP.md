# Supabase Setup Guide

This guide walks you through connecting **Reflekt** to your own Supabase project for cloud sync.

---

## Prerequisites

- A free [Supabase](https://supabase.com) account
- Node.js 18+ installed

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Fill in:
   - **Name**: `reflekt` (or anything you prefer)
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Pick the closest to you
4. Click **Create new project** and wait ~2 minutes for it to provision

---

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings → API**
2. Copy these two values:
   - **Project URL** — e.g. `https://abcdefghij.supabase.co`
   - **anon / public key** — the long `eyJ...` string

---

## Step 3: Run the Setup Script

From the project root, run:

```bash
npm run setup
```

This interactive script will:

1. Ask for your Supabase URL and anon key
2. Validate the connection
3. Create a `.env` file with your credentials
4. Print the SQL migration you need to run

> **Manual alternative**: If you prefer, copy `.env.example` to `.env` and fill in your values manually.

---

## Step 4: Create the Database Table

The setup script outputs a SQL migration. Copy it and:

1. Go to **Supabase Dashboard → SQL Editor**
2. Click **New query**
3. Paste the SQL migration
4. Click **Run**

The migration creates:

- An `entries` table with `id`, `user_id`, `title`, `content`, `created_at`, `updated_at`
- Indexes for fast lookups
- Row Level Security (RLS) policies so users can only access their own entries
- An auto-update trigger for `updated_at`

### SQL Reference

If you need to run it manually, here's the full migration:

```sql
CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Entry',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entries"
  ON entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
  ON entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON entries FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER entries_updated_at
  BEFORE UPDATE ON entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Step 5: Configure Auth (Optional)

By default, Supabase Auth requires email confirmation. To disable it for development:

1. Go to **Authentication → Providers → Email**
2. Toggle off **Confirm email**

To enable third-party logins (Google, GitHub, etc.), configure them under **Authentication → Providers**.

---

## Step 6: Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and start journaling!

---

## Troubleshooting

| Issue                             | Solution                                                       |
| --------------------------------- | -------------------------------------------------------------- |
| "Invalid API key"                 | Double-check your anon key in `.env`                           |
| "relation entries does not exist" | Run the SQL migration in Step 4                                |
| "new row violates RLS policy"     | Make sure RLS policies were created and you're signed in       |
| Entries not showing up            | Check that `user_id` matches the logged-in user's `auth.uid()` |

---

## Architecture

```
Browser (React App)
    │
    ├─── Supabase Auth ──→ auth.users table
    │
    └─── Supabase Client ──→ entries table (with RLS)
                               │
                               └─── Only YOUR entries are accessible
```

Your data is secure: Row Level Security ensures each user can only read, write, and delete their own entries.
