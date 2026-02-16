#!/usr/bin/env node

/**
 * Reflekt — Supabase Setup Script
 *
 * Interactive CLI tool that:
 * 1. Prompts for Supabase project URL and anon key
 * 2. Validates the connection
 * 3. Writes the .env file
 * 4. Outputs the SQL migration to create the entries table
 *
 * Usage: node scripts/setup-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, existsSync } from 'fs'
import { createInterface } from 'readline'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..')
const ENV_PATH = resolve(PROJECT_ROOT, '.env')

// ─── Colors for terminal output ───────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
}

function log(msg) { console.log(msg) }
function success(msg) { log(`${c.green}✓${c.reset} ${msg}`) }
function warn(msg) { log(`${c.yellow}⚠${c.reset} ${msg}`) }
function error(msg) { log(`${c.red}✗${c.reset} ${msg}`) }
function heading(msg) { log(`\n${c.bold}${c.cyan}${msg}${c.reset}`) }

// ─── Readline prompt helper ──────────────────────────────────
function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(`${c.bold}${question}${c.reset} `, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

// ─── SQL Migration ───────────────────────────────────────────
const SQL_MIGRATION = `
-- ============================================
-- Reflekt — Database Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Create the entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Entry',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create an index for fast user-based lookups
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — users can only access their own entries
CREATE POLICY "Users can view their own entries"
  ON entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
  ON entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON entries FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER entries_updated_at
  BEFORE UPDATE ON entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
`.trim()

// ─── Main ────────────────────────────────────────────────────
async function main() {
  log('')
  log(`${c.bold}${c.magenta}◆ Reflekt — Supabase Setup${c.reset}`)
  log(`${c.dim}─────────────────────────────────────${c.reset}`)

  // Step 1: Check for existing .env
  if (existsSync(ENV_PATH)) {
    warn(`.env file already exists at ${ENV_PATH}`)
    const overwrite = await prompt('Overwrite? (y/N):')
    if (overwrite.toLowerCase() !== 'y') {
      log('Setup cancelled.')
      process.exit(0)
    }
  }

  // Step 2: Collect credentials
  heading('Step 1: Enter your Supabase credentials')
  log(`${c.dim}Find these at: https://supabase.com/dashboard → Project → Settings → API${c.reset}\n`)

  const supabaseUrl = await prompt('Supabase Project URL:')
  if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
    error('Invalid URL. Must start with https://')
    process.exit(1)
  }

  const supabaseKey = await prompt('Supabase Anon Key:')
  if (!supabaseKey || supabaseKey.length < 20) {
    error('Invalid anon key. It should be a long JWT string.')
    process.exit(1)
  }

  // Step 3: Validate the connection
  heading('Step 2: Validating connection...')

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error: authError } = await supabase.auth.getSession()

    if (authError) {
      throw new Error(authError.message)
    }

    success('Successfully connected to Supabase!')
  } catch (err) {
    error(`Connection failed: ${err.message}`)
    error('Please double-check your URL and anon key.')
    process.exit(1)
  }

  // Step 4: Write .env file
  heading('Step 3: Writing .env file...')

  const envContent = [
    '# Reflekt — Supabase Configuration',
    `# Generated on ${new Date().toISOString()}`,
    '',
    `VITE_SUPABASE_URL=${supabaseUrl}`,
    `VITE_SUPABASE_ANON_KEY=${supabaseKey}`,
    '',
  ].join('\n')

  writeFileSync(ENV_PATH, envContent, 'utf-8')
  success(`.env file written to ${ENV_PATH}`)

  // Step 5: Output the SQL migration
  heading('Step 4: Database Migration')
  log(`\n${c.dim}Run the following SQL in your Supabase Dashboard → SQL Editor:${c.reset}\n`)
  log(`${c.yellow}${'─'.repeat(50)}${c.reset}`)
  log(SQL_MIGRATION)
  log(`${c.yellow}${'─'.repeat(50)}${c.reset}`)

  // Done
  heading('✅ Setup Complete!')
  log('')
  log(`  1. Copy the SQL above and run it in ${c.cyan}Supabase Dashboard → SQL Editor${c.reset}`)
  log(`  2. Start the dev server: ${c.cyan}npm run dev${c.reset}`)
  log(`  3. Sign up with your email and start journaling!`)
  log('')
  log(`${c.dim}For detailed instructions, see SUPABASE_SETUP.md${c.reset}`)
  log('')
}

main().catch((err) => {
  error(`Unexpected error: ${err.message}`)
  process.exit(1)
})
