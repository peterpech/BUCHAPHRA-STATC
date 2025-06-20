# BuchaPhra Project

This repository provides a monorepo-style structure with separate frontend and backend packages.

- `frontend` contains the Next.js application.
- `backend` contains the Express.js API server.
- `mock` stores mock data and utilities.

Continuous integration is configured via GitHub Actions in `.github/workflows/ci.yml`.

## Development

Run each package independently:

```bash
cd frontend
npm install
npm run dev
```

```bash
cd backend
npm install
npm run dev
```

The frontend runs on [http://localhost:3000](http://localhost:3000) by default and the backend listens on port `3001`.
