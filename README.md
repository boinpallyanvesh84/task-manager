# Task Manager

A simple task management web app built with Angular, styled as a Kanban-style board. Users can create, view, edit, and delete tasks, with all data persisted locally in the browser via `localStorage`.

## Assignment Overview

This project implements a Task Manager page matching the provided mock-up, with full CRUD (Create, Read, Update, Delete) functionality, client-side form validation, and a responsive layout for desktop and mobile.

## Features

- Add a new task via a modal dialog (title, optional description, status)
- View all tasks grouped into three columns by status: Pending, In Progress, Completed
- Edit an existing task (the same modal pre-fills with the task's current data)
- Delete a task, with a confirmation prompt before removal
- Search tasks by title or description (filters the board live)
- Form validation: task title is required
- Tasks persist across page refreshes via `localStorage`
- Friendly empty state ("No tasks found. Add your first task.") when there are no tasks at all, and a per-column message when a single column is empty
- Responsive layout: sidebar collapses and columns stack to a single column on mobile

## Tech Stack

- Angular 18 (standalone components, no NgModules)
- TypeScript
- Reactive Forms (`@angular/forms`)
- Plain CSS (no UI framework)
- Browser `localStorage` for persistence
- ESLint (`@angular-eslint`) for linting

## Folder Structure

```
task-manager/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── task-form/     # Add/Edit task form, rendered inside a modal
│   │   │   ├── task-list/     # Groups tasks into Pending/In Progress/Completed columns
│   │   │   └── task-item/     # Single task card (avatar, edit/delete icon buttons)
│   │   ├── models/
│   │   │   └── task.ts        # Task interface + TaskStatus type
│   │   ├── services/
│   │   │   └── task.service.ts # CRUD logic + localStorage persistence
│   │   ├── app.component.ts   # Sidebar/topbar shell, search, modal state, wiring
│   │   └── app.component.html
│   ├── styles.css             # Global styles + shared button/empty-state classes
│   └── index.html
├── angular.json
├── package.json
└── README.md
```

## Setup Instructions

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install
```

## Running Locally

```bash
ng serve
```

Then open `http://localhost:4200/` in your browser.

If you don't have the Angular CLI installed globally, you can also run:

```bash
npx ng serve
```

## CRUD Explanation

All task operations live in `TaskService` (`src/app/services/task.service.ts`), which is the single source of truth for task data:

- **Create**: `addTask(title, description, status)` generates a new task with a unique id and timestamps, then saves it.
- **Read**: `tasks` is a reactive Angular signal that components read directly; the UI updates automatically whenever the underlying data changes. `task-list` groups the current tasks into the three status columns.
- **Update**: `updateTask(id, changes)` finds the task by id, applies the changes, and refreshes its `updatedAt` timestamp.
- **Delete**: `deleteTask(id)` removes the task by id after the user confirms via a browser confirmation dialog.

`AppComponent` coordinates the UI: it holds whether the add/edit modal is open and which task (if any) is being edited, and wires the `task-form` and `task-list` components to the service. Clicking "New task" opens the modal in add mode; clicking a card's edit icon opens it pre-filled in edit mode.

## localStorage Explanation

Tasks are stored under a single key (`task-manager.tasks`) as a JSON array. Every time a task is added, updated, or deleted, the full task list is serialized and written back to `localStorage`. On app startup, `TaskService` reads and parses that key to restore the previous session's tasks. This is what makes tasks survive a page refresh with no backend involved.

## Assumptions

- No backend/API: all data is local to the browser (per assignment requirements).
- A single confirmation dialog (`window.confirm`) is used for delete confirmation, kept simple rather than a custom modal.
- Task status is a fixed set of three values: `Pending`, `In Progress`, `Completed`, matching the mock-up's three-column layout.
- The mock-up's card avatars represent an assignee, a field not present in the assignment's task data model. Replaced with a colored circle showing the task title's first letter.
- Sidebar navigation items (Dashboard, Projects, Calendar, Log out) are static/decorative, matching the mock-up's visual layout; only the Tasks page is implemented.

## Author

Anvesh Boinpally
