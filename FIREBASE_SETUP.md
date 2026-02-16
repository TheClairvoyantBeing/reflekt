# Firebase Setup Guide

This guide walks you through connecting **Reflekt** to your own Firebase project for cloud sync.

---

## Prerequisites

- A free [Firebase](https://firebase.google.com) account (Google account)
- Node.js 18+ installed

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project**
3. Enter project name: `reflekt` (or anything you prefer)
4. Disable Google Analytics (optional, not needed)
5. Click **Create project**

---

## Step 2: Add a Web App

1. In your Firebase project, click the **web icon** (`</>`) to add a web app
2. Register app name: `reflekt-web`
3. **Don't** enable Firebase Hosting (optional)
4. Click **Register app**
5. You'll see a `firebaseConfig` object — copy these values:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

---

## Step 3: Enable Authentication

1. Go to **Authentication** (left sidebar)
2. Click **Get started**
3. Click **Email/Password**
4. Toggle **Enable** → click **Save**

---

## Step 4: Create Cloud Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose **Start in production mode**
4. Select a location closest to you
5. Click **Done**

---

## Step 5: Set Firestore Security Rules

1. Go to **Firestore Database → Rules**
2. Replace the default rules with:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Entries — users can only access their own
    match /entries/{entryId} {
      allow read, update, delete: if request.auth != null
                                  && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.user_id == request.auth.uid;
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**

---

## Step 6: Create Firestore Index

Reflekt queries entries by `user_id` and orders by `created_at`. You need a composite index:

1. Go to **Firestore Database → Indexes**
2. Click **Create Index**
3. Collection: `entries`
4. Fields:
   - `user_id` — Ascending
   - `created_at` — Descending
5. Query scope: **Collection**
6. Click **Create**

> **Alternatively**, the app will show an error link in the browser console the first time you load entries. Click that link and Firebase will auto-create the index for you.

---

## Step 7: Run the Setup Script

From the project root:

```bash
npm run setup
```

This will ask for your Firebase config values and write the `.env` file.

> **Manual alternative**: Copy `.env.example` to `.env` and fill in your values.

---

## Step 8: Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and start journaling!

---

## Troubleshooting

| Issue                                            | Solution                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| "Firebase: Error (auth/configuration-not-found)" | Check your API key and project ID in `.env`                       |
| "Missing or insufficient permissions"            | Update Firestore security rules (Step 5)                          |
| "The query requires an index"                    | Click the link in the console to auto-create it, or follow Step 6 |
| Entries not showing up                           | Check that `user_id` field matches the signed-in user's UID       |

---

## Architecture

```
Browser (React App)
    │
    ├─── Firebase Auth ──→ User authentication (email/password)
    │
    └─── Cloud Firestore ──→ entries collection
                               │
                               └─── Security rules ensure only YOUR entries are accessible
```

Your data is secure: Firestore security rules ensure each user can only read, write, and delete their own entries.

---

## Firebase Free Tier (Spark Plan) Limits

| Resource          | Free Limit  |
| ----------------- | ----------- |
| Auth users        | Unlimited   |
| Firestore reads   | 50,000/day  |
| Firestore writes  | 20,000/day  |
| Firestore storage | 1 GB        |
| Bandwidth         | 10 GB/month |

For a personal diary app, you'll never come close to these limits.
