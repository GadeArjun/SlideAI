# SlideAI Frontend

Production-ready React frontend for the SlideAI — AI PowerPoint Generator SaaS.

## Stack

| Layer        | Tech                  |
| ------------ | --------------------- |
| Framework    | React 18 + Vite       |
| Styling      | Tailwind CSS          |
| Routing      | React Router DOM v6   |
| Server state | TanStack Query v5     |
| Client state | Zustand               |
| HTTP         | Axios                 |
| Animations   | Framer Motion         |
| Forms        | React Hook Form + Zod |
| Icons        | Lucide React          |
| Realtime     | Socket.IO Client      |
| Toasts       | Sonner                |

## Folder Structure

```
src/
  api/          # Axios instance + API service files
  components/
    common/     # Shared UI (loaders, skeletons, modals, badges)
    dashboard/  # Sidebar, Topbar
    project/    # ProjectCard, GenerationTracker
    auth/       # Auth-specific components
  constants/    # API endpoints, socket events, query keys
  hooks/        # useAuth, useProjects, useSocket
  layouts/      # DashboardLayout
  lib/          # utils (cn, formatDate, etc)
  pages/        # One file per page
  providers/    # AuthProvider, QueryProvider
  routes/       # ProtectedRoute, PublicRoute guards
  services/     # socketService singleton
  store/        # Zustand stores (auth, ui, project)
  styles/       # globals.css
```

## Backend API Mapping

All API calls match your backend exactly:

| Frontend                 | Backend Route                       |
| ------------------------ | ----------------------------------- |
| `authApi.register`       | `POST /api/users/register`          |
| `authApi.login`          | `POST /api/users/login`             |
| `authApi.getMe`          | `GET /api/users/me`                 |
| `authApi.updateProfile`  | `PATCH /api/users/profile`          |
| `authApi.changePassword` | `PATCH /api/users/change-password`  |
| `authApi.getUserStats`   | `GET /api/users/stats`              |
| `projectsApi.create`     | `POST /api/projects/create`         |
| `projectsApi.getAll`     | `GET /api/projects/`                |
| `projectsApi.getList`    | `GET /api/projects/list/all`        |
| `projectsApi.getById`    | `GET /api/projects/:id`             |
| `projectsApi.getStatus`  | `GET /api/projects/:id/status`      |
| `projectsApi.getFull`    | `GET /api/projects/:id/full`        |
| `projectsApi.resume`     | `POST /api/projects/:id/resume`     |
| `projectsApi.editSlide`  | `POST /api/projects/:id/edit-slide` |
| `projectsApi.delete`     | `DELETE /api/projects/:id`          |

## Socket Events Handled

All real-time events from your backend are handled in `useSocket.js`:

- `project:created:start` → Generation started
- `intent:completed` → AI intent extracted
- `planner:start` / `planner:slide:status` / `planner:completed` → Planning progress
- `coder:start` / `coder:complete` → Per-slide generation
- `project:completed` → Full presentation ready
- `project:error` → Generation failed
- `editor:start` / `editor:completed` / `editor:error` → Slide edit events

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set your backend URL

# 3. Start dev server
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` and `/socket.io` to your backend at `http://localhost:3000`.

## Auth Flow

1. On app load, `AuthProvider` reads the JWT from localStorage
2. Calls `GET /api/users/me` to verify and restore session
3. If valid → restores user, connects socket
4. If 401 → clears auth, redirects to login

## Production Build

```bash
npm run build
# Output in /dist
```
