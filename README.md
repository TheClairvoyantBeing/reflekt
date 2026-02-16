# ◆ Reflekt

A beautifully crafted personal diary and journaling app with Supabase cloud sync.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)

---

## Features

- **Secure Authentication** — Sign up / sign in via Supabase Auth (email + password)
- **Create Entries** — Write journal entries with title and content
- **Browse & Delete** — View all past entries, delete ones you no longer want
- **Cloud Sync** — Entries are stored in Supabase and accessible from any device
- **Row Level Security** — Your entries are private; only you can access them
- **Premium Dark UI** — Glassmorphism, gradient accents, smooth micro-animations
- **Responsive** — Works on desktop, tablet, and mobile
- **Real-time Word Count** — See your word count as you write

---

## Tech Stack

| Layer         | Technology                         |
| ------------- | ---------------------------------- |
| Frontend      | React 18, React Router 7           |
| Build Tool    | Vite 6                             |
| Backend/DB    | Supabase (PostgreSQL + Auth + RLS) |
| Styling       | Vanilla CSS with custom properties |
| Notifications | react-hot-toast                    |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A free [Supabase](https://supabase.com) account

### Installation

```bash
# Clone the repo
git clone https://github.com/TheClairvoyantBeing/reflekt.git
cd reflekt

# Install dependencies
npm install

# Set up Supabase (interactive)
npm run setup

# Start the dev server
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Supabase Setup

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for detailed instructions on:

- Creating a Supabase project
- Running the database migration
- Configuring authentication
- Connecting the app

---

## Project Structure

```
reflekt/
├── scripts/
│   └── setup-supabase.mjs    # Interactive Supabase setup CLI
├── src/
│   ├── components/
│   │   ├── Layout.jsx         # App shell with navbar
│   │   ├── ProtectedRoute.jsx # Auth guard
│   │   └── EntryCard.jsx      # Reusable entry display card
│   ├── lib/
│   │   ├── supabase.js        # Supabase client initialization
│   │   └── entries.js         # Entry CRUD operations
│   ├── pages/
│   │   ├── LoginPage.jsx      # Login / Sign up
│   │   ├── DashboardPage.jsx  # Home dashboard
│   │   ├── NewEntryPage.jsx   # Create new entry
│   │   └── EntriesPage.jsx    # Browse all entries
│   ├── styles/
│   │   ├── globals.css        # Design tokens, reset, shared components
│   │   ├── layout.css         # Navbar and app shell
│   │   ├── login.css          # Login page
│   │   ├── dashboard.css      # Dashboard page
│   │   ├── entry.css          # New entry page
│   │   └── entries.css        # Entries list page
│   ├── App.jsx                # Router and auth state
│   └── main.jsx               # Entry point
├── .env.example               # Environment variable template
├── index.html                 # Vite HTML entry
├── package.json
├── vite.config.js
├── SUPABASE_SETUP.md          # Supabase setup guide
└── README.md
```

---

## Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Build for production       |
| `npm run preview` | Preview production build   |
| `npm run setup`   | Interactive Supabase setup |

---

## Renaming the Repo

If you forked or cloned this and want to rename it:

1. **GitHub**: Go to [repo settings](https://github.com/TheClairvoyantBeing/fsd_project/settings) → **General → Repository name** → change to `reflekt`
2. **Local**: Update the remote URL:
   ```bash
   git remote set-url origin https://github.com/TheClairvoyantBeing/reflekt.git
   ```

---

## License

MIT — feel free to use, modify, and share.
