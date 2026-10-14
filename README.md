
# Task Tracker API

A full-stack task management application built with
C#, ASP.NET Core, Entity Framework Core and SQLite.

## Features

- Create tasks with a title and description
- View all tasks
- Edit existing tasks
- Mark tasks as completed
- Delete tasks with confirmation
- Store tasks in a SQLite database
- Responsive web interface using HTML, CSS and JavaScript

## Technologies

- C#
- ASP.NET Core Minimal API
- Entity Framework Core (Code First)
- SQLite
- HTML, CSS, JavaScript
- REST API

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/{id} | Get task by ID |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |

## Running the Project

1. Install the .NET SDK matching the project.
2. Clone the repository.
3. Open a terminal in the project directory.
4. Run the following commands:

```bash
dotnet restore
dotnet ef database update
dotnet run
```

5. Open the local URL displayed in the terminal.

## Database

The application uses SQLite and Entity Framework Core
Code First migrations.

The local database file is not included in Git.

## What I Learned

- Building RESTful APIs with ASP.NET Core
- Working with Entity Framework Core
- Managing a relational database with SQLite
- Implementing CRUD operations
- Connecting a JavaScript frontend to a C# backend
- Using Git and GitHub for version control
