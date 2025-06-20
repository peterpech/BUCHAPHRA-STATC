# BuchaPhra Monorepo

This repository contains a Next.js frontend and an Express backend in `BuchaPhra/`.
Mock JSON data lives under `BuchaPhra/mock/`.

## Development

### Frontend
```bash
cd BuchaPhra/frontend
npm install
npm run dev
```

### Backend
```bash
cd BuchaPhra/backend
npm install
npm run dev
```

## Tests
From the repository root run:
```bash
npm test
```
This executes the test suites for both packages.

## Structure
- `BuchaPhra/frontend` – Next.js application
- `BuchaPhra/backend` – Express API server
- `BuchaPhra/mock` – example JSON data
- `.github/workflows` – CI configuration
