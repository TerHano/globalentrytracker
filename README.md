# Global Entry Tracker

A full-stack web application that monitors U.S. Customs and Border Protection (CBP) Global Entry enrollment center appointment availability and sends real-time notifications when slots open up.

## Features

- **Appointment Tracking** — Monitor one or more Global Entry enrollment center locations simultaneously
- **Real-time Notifications** — Get alerted the moment an appointment slot becomes available
  - Email notifications (via AWS SES / SMTP)
  - Discord notifications (via webhooks)
- **Subscription Plans** — Tiered plans powered by Stripe, unlocking more tracked locations and notification channels
- **Dashboard** — At-a-glance view of all active trackers and their status
- **Settings** — Manage notification preferences, profile, and subscription from a single place
- **Admin Panel** — Internal dashboard for managing users and system state
- **Server-side Rendering** — Fast initial page loads with React Router v7 SSR

## Tech Stack

### Frontend

| Technology                                             | Purpose                                            |
| ------------------------------------------------------ | -------------------------------------------------- |
| [React Router v7](https://reactrouter.com/)            | Full-stack framework with SSR                      |
| [TypeScript](https://www.typescriptlang.org/)          | Type safety                                        |
| [Mantine](https://mantine.dev/)                        | UI component library                               |
| [TailwindCSS](https://tailwindcss.com/)                | Utility-first styling                              |
| [TanStack Query](https://tanstack.com/query)           | Server state management                            |
| [Zod](https://zod.dev/)                                | Schema validation                                  |
| [i18next](https://www.i18next.com/)                    | Internationalization                               |
| [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) | Type-safe API client (generated from OpenAPI spec) |
| [Stripe.js](https://stripe.com/docs/js)                | Subscription payments                              |

### Backend ([GlobalEntryTrackerAPI](https://github.com/TerHano/GlobalEntryTrackerAPI))

| Technology            | Purpose                                                 |
| --------------------- | ------------------------------------------------------- |
| ASP.NET Core (.NET)   | REST API                                                |
| PostgreSQL + EF Core  | Database & migrations                                   |
| ASP.NET Core Identity | Authentication (cookie-based)                           |
| Quartz.NET            | Scheduled jobs (appointment polling, subscription sync) |
| Stripe                | Subscription billing & webhooks                         |
| AWS SES / SMTP        | Email notifications                                     |
| Discord Webhooks      | Discord notifications                                   |
| Serilog               | Structured logging                                      |
| Swagger / OpenAPI     | API documentation & type generation                     |

---

## Getting Started

### Prerequisites

- Node.js 20+
- The [GlobalEntryTrackerAPI](https://github.com/TerHano/GlobalEntryTrackerAPI) backend running locally

### Installation

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Generating API Types

The frontend uses types generated from the backend's OpenAPI spec. With the API running locally, regenerate them with:

```bash
npm run generate-types
```

This outputs the types to `app/types/api.d.ts`.

---

## Building for Production

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```

---

## Code Quality

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Lint and auto-fix
npm run scan
```

---

## Deployment

### Docker

```bash
docker build -t globalentrytracker .
docker run -p 3000:3000 globalentrytracker
```

The production build output structure:

```
build/
├── client/    # Static assets (served by CDN or the Node server)
└── server/    # SSR server entry point
```

The app can be deployed to any Docker-compatible platform (AWS ECS, Google Cloud Run, Fly.io, Railway, etc.).

---

## Project Structure

```
app/
├── api/              # API fetch functions & React Query keys
├── assets/           # Static images and icons
├── components/       # Shared and feature UI components
│   ├── appshell/     # App shell, navigation, header
│   ├── auth/         # Login, signup, reset password forms
│   ├── create-tracker/
│   ├── dashboard/
│   ├── settings/     # Profile, notification & subscription settings
│   ├── pricing/
│   └── ui/           # Generic reusable components
├── hooks/            # Custom React hooks (API hooks, UI hooks)
├── i18n/             # Translation files
├── models/           # Domain model types
├── pages/            # Page-level components
├── routes/           # React Router route modules
└── utils/            # Utility functions
```

---

## Related Repositories

- **API**: [GlobalEntryTrackerAPI](https://github.com/TerHano/GlobalEntryTrackerAPI) — ASP.NET Core backend
