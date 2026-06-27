# Backend Documentation

## Overview

This backend is a Node.js application built with Express.js that serves as the API for an AI-powered presentation generator. It handles user authentication, project management, and the core presentation generation pipeline. The backend is designed to work with a frontend application, serving the frontend's static files and providing a JSON API.

## Project Structure

```
backend/
├── agents/
│   ├── intent_parser/
│   │   ├── agent.js
│   │   └── prompt.txt
│   └── per_slide_content/
│       ├── agent.js
│       └── prompt.txt
├── config/
│   ├── db.js
│   └── llm.js
├── controllers/
│   ├── project.controller.js
│   └── user.controller.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── Project.model.js
│   └── user.model.js
├── pipeline/
│   └── presentation.pipeline.js
├── public/
│   └── dist/
├── routes/
│   ├── project.routes.js
│   └── user.routes.js
├── services/
│   └── project.service.js
├── .env.example
├── package.json
└── server.js
```

### Key Components

- **`server.js`**: The main entry point of the application. It initializes the Express server, connects to the database, sets up middleware, and defines the API routes.
- **`routes/`**: This directory contains the API route definitions.
  - `user.routes.js`: Handles user authentication and user data retrieval.
  - `project.routes.js`: Manages presentation projects, including creation, deletion, and retrieval.
- **`controllers/`**: These files contain the business logic for the API routes.
  - `user.controller.js`: Implements user signup, login, and profile retrieval.
  - `project.controller.js`: Handles the creation and management of presentation projects.
- **`pipeline/`**: This is the core of the AI functionality.
  - `presentation.pipeline.js`: Orchestrates the process of generating a presentation, from understanding the user's prompt to creating the slide content.
- **`agents/`**: These are specialized AI agents that perform specific tasks in the presentation generation pipeline.
  - `intent_parser/`: Parses the user's initial prompt to determine their intent.
  - `per_slide_content/`: Generates the content for each slide.
- **`services/`**: These files abstract the database interactions.
  - `project.service.js`: Provides a clean API for CRUD (Create, Read, Update, Delete) operations on projects.
- **`models/`**: Defines the data schema for the MongoDB database.
  - `user.model.js`: User schema, including name, email, and password.
  - `Project.model.js`: Project schema, which stores information about the presentations.
- **`middleware/`**: Contains Express middleware.
  - `auth.middleware.js`: Protects routes by verifying JSON Web Tokens (JWTs).
- **`config/`**: Configuration files.
  - `db.js`: Handles the connection to the MongoDB database.
  - `llm.js`: Likely contains configuration for the Large Language Model (LLM) used by the agents.
- **`public/dist/`**: This directory contains the built frontend application, which is served statically by the backend.

## API Endpoints

### User

- **`POST /api/user/register`**: Creates a new user account.
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

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the following variables:
    ```
    PORT=8080
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```
3.  **Start the server:**
    ```bash
    npm start
    ```

The server will start on the port specified in your `.env` file (defaulting to 8080).
