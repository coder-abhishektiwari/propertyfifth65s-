# Property Fifth

Premium real-estate advisory web application for NRI / UHNI clients and Defence Personnel.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- PostgreSQL
- Prisma
- Git / GitHub

The application is designed as a single full-stack Next.js project. Frontend and backend functionality live in the same application.

---

## Project Documentation

Read these before making substantial changes:

- `AGENTS.md` — permanent rules for coding agents
- `PROJECT.md` — product requirements, pages, features, UI direction, and scope
- `DATABASE.md` — database schema and data contract
- `requirements/` — UI reference images

For exact screen design, the relevant image inside `requirements/` is the visual source of truth.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local environment file:

```bash
.env.local
```

Add the environment variables required by the current implementation.

Never commit secrets, passwords, API keys, or database credentials to Git.

### 3. Start development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The application is intended to run on a Node.js-compatible VPS in production.

A typical production setup is:

```text
Internet
   ↓
Nginx
   ↓
Next.js
   ↓
PostgreSQL
```

PM2 can be used to keep the Next.js process running.

Deployment/server configuration is separate from application code.

---

## Database

The production database is PostgreSQL and the project uses Prisma for database access.

The database schema and data contract are documented in:

```text
DATABASE.md
```

Do not change the schema without first checking `DATABASE.md` and following the schema-change rules in `AGENTS.md`.

Typical Prisma commands may include:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Use only the commands appropriate to the current database setup.

---

## Main Application Areas

### Public Website

- Home
- Properties
- Property Detail
- Saved Properties
- Services
- About Us
- Contact

### Admin

- Property Management
- Consultation Requests
- Call Back Requests

Admin authentication is separate from the public customer experience.

---

## Property Images

Property images are managed through the property management system.

The application supports:

- cover image
- gallery images
- image ordering
- image deletion

Do not add 360° tours or floor-plan management unless explicitly requested.

Uploaded media should not be committed to Git.

---

## Development Principles

Keep the project:

- simple
- minimal
- maintainable
- production-oriented

Avoid unnecessary:

- dependencies
- abstractions
- folders
- database tables
- APIs
- state-management libraries
- animation libraries

Do not use Framer Motion unless explicitly requested.

Prefer existing Next.js, TypeScript, CSS, and browser capabilities when they are sufficient.

---

## Before Submitting a Change

Check the affected functionality and, when practical, run:

```bash
npm run lint
npm run build
```

Also verify that:

- the requested feature works
- existing functionality is not broken
- responsive layouts still work
- no unnecessary files or dependencies were introduced
- sensitive data remains server-side
- documentation is updated if requirements or database structure changed

---

## Repository Structure

The project should remain minimal.

Only create directories/files when they are actually required by the implementation.

Expected documentation/reference files:

```text
AGENTS.md
PROJECT.md
DATABASE.md
README.md
requirements/
```

The exact application source structure should be determined by the implementation rather than created speculatively.

---

## Important

When requirements are unclear, do not invent product behavior.

Check `PROJECT.md`, `DATABASE.md`, and the relevant `requirements/` reference first. If the requirement is still ambiguous, ask for clarification.
