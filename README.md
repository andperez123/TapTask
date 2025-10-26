# TapTask - iOS Shortcuts Marketplace

A modern marketplace for buying and selling iOS Shortcuts, built with React, tRPC, and Node.js.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express, tRPC, Drizzle ORM
- **Database**: MySQL (compatible with PlanetScale)
- **Payment**: Stripe with Apple Pay integration

## Getting Started

### Prerequisites

- Node.js 22.x
- pnpm 8.x
- MySQL 8.x

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
# Copy example env files
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env
```

3. Initialize the database:
```bash
cd server
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

4. Start development servers:
```bash
# Start all services
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Project Structure

```
taptask/
├── client/          # Frontend application
├── server/          # Backend API
├── shared/          # Shared types and utilities
├── drizzle/         # Database schemas and migrations
└── scripts/         # Utility scripts
```

## Development

- Frontend development server: `cd client && pnpm dev`
- Backend development server: `cd server && pnpm dev`
- Run type checking: `pnpm type-check`
- Run linting: `pnpm lint`

## Deployment

The application is designed to be deployed on:
- Frontend: Vercel
- Backend: Railway or any Node.js platform
- Database: PlanetScale or any MySQL-compatible service

## License

ISC
