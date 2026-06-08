# Praja Electric & Automation

Full-stack web application for Praja Electric & Automation — separated into **Frontend**, **Backend**, and **Admin** panels.

## Project Structure

```
praja-electric/
├── frontend/    → Public-facing website (Vite + React)
├── backend/     → REST API server (Express + MongoDB)
└── admin/       → Admin dashboard (Vite + React)
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a remote connection string

### 1. Backend (API Server)

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:5000`

> **Note:** Update the `.env` file in `backend/` with your MongoDB URI and other secrets.

### 2. Frontend (Public Website)

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

### 3. Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

Runs on `http://localhost:5174`

## Environment Variables

The backend `.env` file (`backend/.env`) should contain:

```env
MONGO_URI=mongodb://127.0.0.1:27017/praja-electric
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_URL=cloudinary://your-credentials
```

## Seeding the Database

To populate the database with sample products:

```bash
cd backend
node seed.js
```

## Tech Stack

| Layer    | Technology                                    |
| -------- | --------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Three.js |
| Backend  | Express.js, MongoDB, Mongoose, JWT            |
| Admin    | React 19, Vite, Tailwind CSS, Framer Motion   |
