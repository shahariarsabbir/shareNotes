# 📚 NoteShare — Full Stack Notes Sharing Platform

A full-stack web application where students can upload, share, search, like, and rate academic notes.

---

## 🏗️ Project Structure

```
project/
├── frontend/    (React + Vite)
└── backend/     (Node.js + Express + MongoDB)
```

---

## 👨‍💻 Team Breakdown

| Member | Role | Files |
|--------|------|-------|
| **Member 1** | Frontend / UI | `frontend/src/components/`, `frontend/src/pages/`, `src/styles.css` |
| **Member 2** | Backend APIs | `backend/src/controllers/`, `backend/src/routes/`, `backend/src/app.js` |
| **Member 3** | Database + Auth | `backend/src/models/`, `backend/src/middleware/authMiddleware.js`, `backend/src/utils/generateToken.js` |
| **Member 4** | File Handling + Features | `backend/src/config/cloudinary.js`, `backend/src/middleware/uploadMiddleware.js`, like/rate/search logic in `noteController.js` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Current user |
| POST | `/api/notes/upload` | Private | Upload note (multipart) |
| GET | `/api/notes` | Public | List notes (search, filter, paginate) |
| GET | `/api/notes/:id` | Public | Get note detail |
| DELETE | `/api/notes/:id` | Private | Delete own note |
| PUT | `/api/notes/:id/like` | Private | Toggle like |
| POST | `/api/notes/:id/rate` | Private | Rate note (1-5) |
| PUT | `/api/notes/:id/download` | Public | Track download |
| GET | `/api/users/:id` | Public | Get user profile |
| GET | `/api/users/:id/notes` | Public | Get user's notes |
| PUT | `/api/users/profile` | Private | Update profile |
| PUT | `/api/users/password` | Private | Change password |

---

## ✨ Features

- **Auth** — JWT-based register/login, protected routes
- **Upload** — Drag & drop file upload (PDF, DOCX, PPTX, TXT, images) via Cloudinary
- **Browse** — Search, filter by subject/semester, sort by newest/likes/downloads/views
- **Like** — Toggle likes on notes (real-time count)
- **Rate** — 5-star rating system
- **Profiles** — User profiles with all uploaded notes + stats
- **Dashboard** — Personal stats (notes, likes, views, downloads)
- **Pagination** — Server-side pagination
- **Responsive** — Mobile-friendly layout

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, React Router v6, Axios, React Hot Toast

**Backend:** Node.js, Express, Mongoose, JWT, Bcryptjs, Multer, Cloudinary

**Database:** MongoDB (with text indexes for search)
