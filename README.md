# Task Manager Full-Stack Application

A complete task management application with user authentication, built using Node.js/Express for the backend and React for the frontend.

## Project Structure

```
taskManager/
├── backend/
│   ├── data/           # JSON file storage
│   ├── middleware/     # Auth middleware
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   └── src/
│       ├── components/ # React components
│       ├── context/    # React context API
│       ├── utils/      # Helper functions
│       ├── App.js      # Main application component
│       └── index.js    # Entry point
```

## Backend Setup

1. **Install dependencies**

```bash
cd backend
npm install
```

2. **Start the server**

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000` by default.

## Frontend Setup

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Start the development server**

```bash
npm start
```

The frontend will run on `http://localhost:3000` by default.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Mark tasks as completed
- User-specific task lists
- Responsive design

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user

  - Body: `{ "username": "user1", "password": "password123" }`

- **POST /api/auth/login** - Login and get token
  - Body: `{ "username": "user1", "password": "password123" }`
  - Returns: `{ "token": "jwt-token", "user": { "id": "123", "username": "user1" } }`

### Tasks (Protected Routes)

All task routes require an Authorization header: `Authorization: Bearer your-token`

- **GET /api/tasks** - Get all tasks for current user
- **POST /api/tasks** - Create new task
- **PUT /api/tasks/:id** - Update task
- **DELETE /api/tasks/:id** - Delete task

## Frontend Components

- **Login/Register** - User authentication forms
- **TaskList** - Displays all user tasks
- **TaskItem** - Individual task display with edit/delete controls
- **TaskForm** - Form for creating new tasks
- **TaskModal** - Modal for editing existing tasks
- **Header** - Navigation and user info

## How It Works

1. Users register or login through the frontend interface
2. Authentication generates a JWT token stored in local storage
3. The token is sent with each API request to access protected routes
4. Tasks are stored in JSON files on the backend
5. React components fetch and display tasks from the API
6. User can create, edit, delete, and mark tasks as completed

## Technologies Used

### Backend

- Express.js - Web framework
- JWT - User authentication
- bcryptjs - Password hashing
- File system - JSON-based storage

### Frontend

- React - UI library
- Context API - State management
- CSS - Styling
