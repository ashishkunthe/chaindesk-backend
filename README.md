# Meeting Action Items Tracker

A mini workspace web application that extracts action items from meeting transcripts using an LLM and allows users to manage them.

---

## Features

- Paste meeting transcript
- Automatically extract action items (task, owner, due date)
- Edit action items
- Delete action items
- Mark items as done
- View last 5 processed transcripts
- Backend health status endpoint (`/api/status`)

---

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Zod (validation)
- OpenAI API (gpt-4o-mini)
- JWT Authentication

### Frontend

- React (planned)

---

## Architecture Overview

- A `Transcript` document stores the raw meeting text.
- Each transcript can have multiple `ActionItems`.
- Action items are linked via `transcriptId`.
- All update/delete operations verify transcript ownership before modification.
- LLM responses are validated using Zod before database insertion.
- The health endpoint validates backend, database, and LLM connectivity.

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/ashishkunthe/chaindesk-backend
cd chaindesk-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file using `.env.example` as reference.

Example:

```
MONGODB_URI=
JWT_SECRET=
OPENAI_API_KEY=
PORT=5000
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## Authentication

All protected routes require:

```
Authorization: <JWT_TOKEN>
```

---

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/signin`

### Transcript

- `POST /api/transcript`
- `GET /api/transcript`
- `GET /api/transcript/:id`
- `DELETE /api/transcript/:id`

### Action Items

- `PUT /api/action/:id`
- `DELETE /api/action/:id`

### Status

- `GET /api/status`

---

## What is Implemented

- Structured LLM extraction
- Zod validation for LLM output
- Ownership validation
- Last 5 transcript history
- Action item CRUD
- JWT authentication
- Backend, database, and LLM health checks

---

## Not Implemented

- Pagination beyond 5 transcripts
- Multi-user organization beyond basic ownership
- Real-time updates
- Advanced date normalization

---

## Future Improvements

- Improved natural language date parsing
- Open/Done filters
- Tag support
- Improved frontend user experience
