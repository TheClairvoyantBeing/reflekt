# ◆ Reflekt

A beautifully crafted personal diary and journaling app with Firebase cloud sync, dark/light theme, and a premium UI.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase&logoColor=black)

---

## Features

- **🔒 Secure Authentication** — Email/password via Firebase Auth
- **📝 Create Entries** — Write journal entries with real-time word count
- **📖 Browse & Search** — Search entries by title or content, with staggered animations
- **🗑️ Delete Entries** — Remove entries with confirmation dialog
- **🌗 Dark / Light Mode** — Toggle between themes, persisted in localStorage
- **👤 Profile & Settings** — View account info, change password, delete account
- **☁️ Cloud Sync** — Entries stored in Firestore, accessible from any device
- **🔐 Security Rules** — Firestore rules ensure only your entries are visible
- **📱 Responsive** — Mobile hamburger menu, works on all screen sizes
- **✨ Premium UI** — Glassmorphism, gradient accents, micro-animations

---

## Tech Stack

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Frontend      | React 18, React Router 7                        |
| Build Tool    | Vite 6                                          |
| Auth          | Firebase Authentication                         |
| Database      | Cloud Firestore                                 |
| Styling       | Vanilla CSS + custom properties (design tokens) |
| Notifications | react-hot-toast                                 |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A free [Firebase](https://firebase.google.com) account

### Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/TheClairvoyantBeing/reflekt.git
cd reflekt

# 2. Install dependencies
npm install

# 3. Set up Firebase (interactive — prompts for your config)
npm run setup

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up!

---

## Firebase Setup (for contributors / forks)

If you're setting up this project from scratch, you need a Firebase project:

### 1. Create Project

Go to [Firebase Console](https://console.firebase.google.com) → **Add project** → name it `reflekt`

### 2. Add Web App

Click the web icon (`</>`) → Register as `reflekt-web` → Copy the config object

### 3. Enable Auth

**Authentication** → **Get started** → **Email/Password** → Enable → Save

### 4. Create Firestore

**Firestore Database** → **Create database** → **Production mode** → Pick location → Done

### 5. Set Security Rules

**Firestore → Rules** → Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{entryId} {
      allow read, update, delete: if request.auth != null
                                  && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.user_id == request.auth.uid;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6. Run Setup Script

```bash
npm run setup
```

Paste your Firebase config values when prompted. This writes the `.env` file.

> See **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** for detailed instructions with screenshots.

---

## Project Structure

```
reflekt/
├── scripts/
│   └── setup-firebase.mjs      # Interactive Firebase setup CLI
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # App shell (navbar, hamburger, theme toggle)
│   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   └── EntryCard.jsx       # Reusable entry card
│   ├── context/
│   │   └── ThemeContext.jsx    # Dark/Light mode context + hook
│   ├── lib/
│   │   ├── firebase.js         # Firebase client init
│   │   └── entries.js          # Entry CRUD (Firestore)
│   ├── pages/
│   │   ├── LoginPage.jsx       # Login / Sign up
│   │   ├── DashboardPage.jsx   # Dashboard with stats & quotes
│   │   ├── NewEntryPage.jsx    # Compose new entry
│   │   ├── EntriesPage.jsx     # Browse & search entries
│   │   └── ProfilePage.jsx     # Profile, settings, danger zone
│   ├── styles/                  # One CSS file per page + globals
│   ├── App.jsx                  # Router, auth, ThemeProvider
│   └── main.jsx                 # React 18 entry point
├── .env.example                 # Env var template (safe to commit)
├── .gitignore                   # Excludes .env, node_modules, dist
├── FIREBASE_SETUP.md            # Detailed Firebase guide
├── CONTRIBUTING.md              # Developer guide
└── README.md
```

---

## Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start development server (port 3000)  |
| `npm run build`   | Build for production                  |
| `npm run preview` | Preview production build              |
| `npm run setup`   | Interactive Firebase credential setup |

---

## What NOT to Commit

The `.gitignore` ensures these are excluded:

- `.env` — your Firebase credentials
- `node_modules/` — dependencies
- `dist/` — production build output

The `.env.example` file IS committed so others know which variables to set.

---

## License

MIT — feel free to use, modify, and share.

## Repository Standardization

This repository was standardized on 2026-09-05 under the ownership of [TheClairvoyantBeing](https://github.com/TheClairvoyantBeing).

### Changes applied

- Added a consistent `.gitignore` hygiene section covering IDE metadata (`.idea/`, `.vscode/`), Python caches, Node dependencies, build output, virtual environments, coverage output, `.env` files, and `reviews.md`.
- Ensured `requirements.txt` exists. Existing dependency declarations were preserved; repositories without detected Python dependencies contain a clearly marked placeholder.
- Standardized the repository license to the GNU Affero General Public License v3 (AGPLv3), with TheClairvoyantBeing as the copyright holder. AGPLv3 requires corresponding source to remain available when covered software is distributed or provided as a network service.
- This section records the repository-level maintenance changes; existing project-specific setup, usage, architecture, and development documentation remains above.
