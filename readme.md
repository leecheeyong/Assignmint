# Assignmint API

A student-focused REST API for managing assignments, study goals, and group promises. Built with Node.js, MongoDB, and JWT authentication. Powered by [Vercel](https://vercel.com).

## API Docs
Visit [the Swagger Docs](https://assignmint-seven.vercel.app) for more info

## Features
- User sign-up with JWT authentication
- CRUD for assignments
- Group promises management
- Dashboard summary endpoint

## Authentication
All endpoints (except sign-up) require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Auth
- `POST /api/auth` — Sign up and receive JWT token
  - Request body: `{ email, password }`

### Assignments
- `GET /api/assignments` — Get all assignments
- `POST /api/assignments` — Create a new assignment
- `PUT /api/assignments/:id` — Update an assignment
- `DELETE /api/assignments/:id` — Delete an assignment

### Study Goals
- `GET /api/study-goals` — Get all study goals
- `POST /api/study-goals` — Create a study goal
- `PUT /api/study-goals/:id` — Update a study goal
- `DELETE /api/study-goals/:id` — Delete a study goal

### Group Promises
- `GET /api/group-promises` — Get all group promises
- `POST /api/group-promises` — Create a group promise

### Dashboard Summary
- `GET /api/dashboard-summary` — Get dashboard stats summary

## License
This project is available as an open source under the terms of the [MIT License](LICENSE)
