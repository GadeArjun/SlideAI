# SlideAI: AI PowerPoint Generator

This is a full-stack MERN application that uses AI to generate PowerPoint presentations. The user provides a prompt, and the application generates a complete presentation with a title, slides, and content.

## Project Structure

```
.
├── backend/
│   ├── agents/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── pipeline/
│   ├── public/dist/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   ├── icons/
    │   ├── screenshots/
    │   └── ... (other public assets)
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── constants/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── lib/
    │   ├── pages/
    │   ├── providers/
    │   ├── routes/
    │   ├── services/
    │   ├── store/
    │   └── styles/
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## Stack

### Backend

| Layer          | Tech       |
| -------------- | ---------- |
| Runtime        | Node.js    |
| Framework      | Express.js |
| Database       | MongoDB    |
| ODM            | Mongoose   |
| Authentication | JWT        |

### Frontend

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

## Public Assets (`frontend/public`)

This directory contains static assets for the frontend application.

- **`icons/`**: Contains various sizes of the application icon for different devices and platforms (PWA).
- **`screenshots/`**: Contains screenshots of the application for promotional or informational purposes.
  - `dashboard.png`: A screenshot of the user dashboard.
  - `editor.png`: A screenshot of the presentation editor.
  - `mobile.png`: A screenshot of the mobile view.
- Other root files: `favicon.ico`, `logo.png`, `site.webmanifest`, etc. are standard web assets.

## API Endpoints

### User

- **`POST /api/user/signup`**: Creates a new user account.
- **`POST /api/user/login`**: Logs in a user and returns a JWT.
- **`GET /api/user/me`**: Retrieves the profile of the currently authenticated user.

### Project

- **`POST /api/project/create`**: Creates a new presentation project and starts the generation pipeline.
- **`GET /api/project/`**: Retrieves all projects for the authenticated user.
- **`GET /api/project/:projectId`**: Retrieves a single project by its ID.
- **`DELETE /api/project/:projectId`**: Deletes a project.
- **`POST /api/project/:projectId/pause`**: Pauses the presentation generation pipeline for a project.
- **`POST /api/project/:projectId/resume`**: Resumes the presentation generation pipeline.
- **`GET /api/project/:projectId/state`**: Gets the current state of the pipeline (active, paused).

## Socket Events Handled

The frontend listens for the following real-time events from the backend:

- `project:created:start` → Generation started
- `intent:completed` → AI intent extracted
- `planner:start` / `planner:slide:status` / `planner:completed` → Planning progress
- `coder:start` / `coder:complete` → Per-slide generation
- `project:completed` → Full presentation ready
- `project:error` → Generation failed
- `editor:start` / `editor:completed` / `editor:error` → Slide edit events

## Setup and Development

### Backend

1.  Navigate to the `backend` directory.
2.  Install dependencies: `npm install`
3.  Create a `.env` file and configure your `MONGO_URI` and `JWT_SECRET`.
4.  Start the server: `npm start`

### Frontend

1.  Navigate to the `frontend` directory.
2.  Install dependencies: `npm install`
3.  Create a `.env` file and set `VITE_API_BASE_URL` to your backend URL.
4.  Start the development server: `npm run dev`

## Production Build

### Backend

The backend serves the frontend's build output. No separate build step is required for the backend itself, but you should ensure the frontend has been built first.

### Frontend

1.  Navigate to the `frontend` directory.
2.  Run the build command: `npm run build`
3.  The output will be in the `frontend/dist` directory. The backend is configured to serve static files from `backend/public/dist`, so you will need to move the contents of `frontend/dist` to `backend/public/dist`.
