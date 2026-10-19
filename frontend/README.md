# TaskTrackerAPI

### Full-Stack Kanban Task Management Application

A full-stack task management application built with **ASP.NET Core, React, Entity Framework Core, and SQLite**.

The project provides a Trello-inspired Kanban board where users can create, organize, update, and delete tasks through a modern and responsive interface.

## Features

- **Kanban Board** — Organize tasks into To Do, In Progress, and Done columns.
- **Drag & Drop** — Move tasks between columns using dnd-kit.
- **Task Management** — Create, edit, and delete tasks.
- **Task Details** — View and edit task descriptions and statuses in popup dialogs.
- **Customizable Column Titles** — Rename Kanban columns with names saved in the browser.
- **Dark & Light Mode** — Switch between themes with preferences saved locally.
- **RESTful API** — Backend endpoints for task management.
- **SQLite Persistence** — Tasks remain saved after restarting the application.
- **Responsive Layout** — Interface adapts to different screen sizes.

## Tech Stack

| Backend | Frontend | Database |
|---|---|---|
| C# | React | SQLite |
| ASP.NET Core | JavaScript / JSX | Entity Framework Core |
| Minimal APIs | Vite | EF Core Migrations |
| REST API | dnd-kit | Code First |

## Project Structure

- `Program.cs` — ASP.NET Core application and REST API endpoints.
- `Models/` — Data models.
- `Data/` — Entity Framework Core database context.
- `Migrations/` — Database schema migrations.
- `frontend/` — React and Vite application.
- `frontend/src/components/` — Reusable React components.
- `wwwroot/` — Original HTML, CSS, and JavaScript interface.

## Getting Started

### Prerequisites

- .NET SDK compatible with the project
- Node.js and npm
- Git

### 1. Clone the Repository

`git clone https://github.com/nickalspetrov/TaskTrackerAPI.git`

`cd TaskTrackerAPI`

### 2. Start the Backend

Apply existing EF Core migrations if setting up a new database:

`dotnet ef database update`

Start the ASP.NET Core API:

`dotnet run`

Use the local address shown in the terminal.

### 3. Start the React Frontend

Open a second terminal and navigate to the frontend:

`cd frontend`

Install dependencies:

`npm install`

Start the development server:

`npm run dev`

On Windows PowerShell, you can use `npm.cmd` instead of `npm`.

Open the local address displayed by Vite, usually `http://localhost:5173`.

**Note:** Configure the API proxy target in `frontend/vite.config.js` to match the backend address shown by `dotnet run`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get a task by ID |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update an existing task |
| DELETE | `/api/tasks/{id}` | Delete a task |

## Task Properties

Each task contains:

- **Id** — Unique identifier.
- **Title** — Task name.
- **Description** — Detailed task information.
- **Status** — ToDo, InProgress, or Done.
- **IsCompleted** — Completion indicator.

## Architecture

The React frontend communicates with the ASP.NET Core backend through HTTP requests.

The backend uses Entity Framework Core to manage and persist task data in SQLite.

**React → REST API → Entity Framework Core → SQLite**

## Future Improvements

- Docker containerization
- Automated testing
- Search and task filtering
- Enhanced Drag & Drop interactions
- Deployment

## Repository

[TaskTrackerAPI on GitHub](https://github.com/nickalspetrov/TaskTrackerAPI)