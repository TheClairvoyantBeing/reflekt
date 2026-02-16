# Contributing to Reflekt

Thanks for your interest in contributing! This guide will help you get started.

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Supabase](https://supabase.com) project (free tier)

### Getting Started

```bash
# Clone the repo
git clone https://github.com/TheClairvoyantBeing/reflekt.git
cd reflekt

# Install dependencies
npm install

# Set up Supabase (creates .env with your credentials)
npm run setup

# Start the dev server
npm run dev
```

---

## Project Structure

```
src/
├── components/    → Reusable UI components (Layout, ProtectedRoute, EntryCard)
├── lib/           → Service layer (Supabase client, entry CRUD operations)
├── pages/         → Route-level page components (one per route)
├── styles/        → CSS files (globals.css has design tokens, one file per page)
├── App.jsx        → Router, auth state management, route definitions
└── main.jsx       → React entry point
```

### Conventions

| Convention          | Example                                          |
| ------------------- | ------------------------------------------------ |
| Page components     | `DashboardPage.jsx` (end with `Page`)            |
| Reusable components | `EntryCard.jsx` (PascalCase, descriptive)        |
| Service modules     | `entries.js` (lowercase, noun-based)             |
| CSS files           | `dashboard.css` (match the component they style) |
| CSS classes         | `.entry-card-title` (BEM-like, kebab-case)       |

### Design Tokens

All colors, spacing, typography, and radii are defined as CSS custom properties in `src/styles/globals.css`. **Always use tokens** instead of hardcoding values:

```css
/* ✅ Good */
color: var(--color-text-muted);
padding: var(--space-4);
border-radius: var(--radius-md);

/* ❌ Bad */
color: #94a3b8;
padding: 16px;
border-radius: 10px;
```

---

## Adding a New Page

1. Create `src/pages/YourPage.jsx`
2. Create `src/styles/yourpage.css` (import design tokens)
3. Add a route in `src/App.jsx` (wrap with `ProtectedRoute` + `Layout` if authenticated)
4. Add a nav link in `src/components/Layout.jsx`

---

## Supabase Queries

All database operations go through `src/lib/entries.js`. If adding new tables:

1. Write the SQL migration and add it to `SUPABASE_SETUP.md`
2. Create a new service file in `src/lib/` (e.g., `tags.js`)
3. Follow the existing pattern: export async functions that return `{ data, error }`

---

## Pull Request Guidelines

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Run `npm run build` to verify zero errors
4. Commit with clear messages: `feat: add tag support to entries`
5. Push and open a PR

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
