# NoteShare Backend API

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, and Cloudinary credentials
npm run dev
```

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login user |
| GET | /api/auth/me | Private | Get current user |
| POST | /api/notes/upload | Private | Upload note (multipart/form-data) |
| GET | /api/notes | Public | Get all notes (search, filter, paginate) |
| GET | /api/notes/:id | Public | Get single note |
| DELETE | /api/notes/:id | Private | Delete note (owner/admin) |
| PUT | /api/notes/:id/like | Private | Toggle like on a note |
| POST | /api/notes/:id/rate | Private | Rate a note (1–5) |
| PUT | /api/notes/:id/download | Public | Increment download count |
| GET | /api/users/:id | Public | Get user profile |
| GET | /api/users/:id/notes | Public | Get notes by user |
| PUT | /api/users/profile | Private | Update own profile |
| PUT | /api/users/password | Private | Change password |

## Upload Note (multipart/form-data fields)

- `file` — The actual file (PDF, DOC, DOCX, PPT, PPTX, TXT, PNG, JPG)
- `title` — Note title
- `description` — Short description
- `subject` — Subject name
- `semester` — (optional)
- `tags` — Comma-separated tags (optional)

## Query Parameters for GET /api/notes

- `search` — Full-text search
- `subject` — Filter by subject
- `semester` — Filter by semester
- `sort` — Sort field (default: `-createdAt`, options: `-likesCount`, `-downloads`, `-views`)
- `page` — Page number (default: 1)
- `limit` — Results per page (default: 12)
