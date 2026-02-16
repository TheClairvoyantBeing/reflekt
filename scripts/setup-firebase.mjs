#!/usr/bin/env node

/**
 * Reflekt — Firebase Setup Script
 *
 * Interactive CLI tool that:
 * 1. Prompts for Firebase project config
 * 2. Writes the .env file
 * 3. Outputs Firestore security rules
 *
 * Usage: node scripts/setup-firebase.mjs
 */

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

// ─── Firestore Security Rules ────────────────────────────────
const FIRESTORE_RULES = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Entries collection — users can only access their own entries
    match /entries/{entryId} {
      allow read, update, delete: if request.auth != null
                                  && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.user_id == request.auth.uid;
    }

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`.trim()

// ─── Main ────────────────────────────────────────────────────
async function main() {
  log('')
  log(`${c.bold}${c.magenta}◆ Reflekt — Firebase Setup${c.reset}`)
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

  // Step 2: Collect Firebase config
  heading('Step 1: Enter your Firebase config')
  log(`${c.dim}Find these at: Firebase Console → Project Settings → General → Your Apps → Config${c.reset}\n`)

  const apiKey = await prompt('API Key:')
  if (!apiKey) { error('API Key is required.'); process.exit(1) }

  const authDomain = await prompt('Auth Domain (e.g. my-app.firebaseapp.com):')
  if (!authDomain) { error('Auth Domain is required.'); process.exit(1) }

  const projectId = await prompt('Project ID:')
  if (!projectId) { error('Project ID is required.'); process.exit(1) }

  const storageBucket = await prompt('Storage Bucket (e.g. my-app.firebasestorage.app):')
  const messagingSenderId = await prompt('Messaging Sender ID:')
  const appId = await prompt('App ID:')
  if (!appId) { error('App ID is required.'); process.exit(1) }

  // Step 3: Write .env file
  heading('Step 2: Writing .env file...')

  const envContent = [
    '# Reflekt — Firebase Configuration',
    `# Generated on ${new Date().toISOString()}`,
    '',
    `VITE_FIREBASE_API_KEY=${apiKey}`,
    `VITE_FIREBASE_AUTH_DOMAIN=${authDomain}`,
    `VITE_FIREBASE_PROJECT_ID=${projectId}`,
    `VITE_FIREBASE_STORAGE_BUCKET=${storageBucket}`,
    `VITE_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}`,
    `VITE_FIREBASE_APP_ID=${appId}`,
    '',
  ].join('\n')

  writeFileSync(ENV_PATH, envContent, 'utf-8')
  success(`.env file written to ${ENV_PATH}`)

  // Step 4: Output Firestore rules
  heading('Step 3: Firestore Security Rules')
  log(`\n${c.dim}Copy the following rules to: Firebase Console → Firestore → Rules${c.reset}\n`)
  log(`${c.yellow}${'─'.repeat(50)}${c.reset}`)
  log(FIRESTORE_RULES)
  log(`${c.yellow}${'─'.repeat(50)}${c.reset}`)

  // Done
  heading('✅ Setup Complete!')
  log('')
  log(`  1. Enable ${c.cyan}Authentication → Email/Password${c.reset} in Firebase Console`)
  log(`  2. Create a ${c.cyan}Cloud Firestore${c.reset} database (start in production mode)`)
  log(`  3. Paste the security rules above into ${c.cyan}Firestore → Rules${c.reset}`)
  log(`  4. Start the dev server: ${c.cyan}npm run dev${c.reset}`)
  log(`  5. Sign up and start journaling!`)
  log('')
  log(`${c.dim}For detailed instructions, see FIREBASE_SETUP.md${c.reset}`)
  log('')
}

main().catch((err) => {
  error(`Unexpected error: ${err.message}`)
  process.exit(1)
})
