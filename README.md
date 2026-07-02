# Udyam Registration Verification Clone

A high-fidelity, responsive clone of Step 1 (Aadhaar Verification) and Step 2 (PAN Verification) of the official Indian Government [Udyam Registration Portal](https://udyamregistration.gov.in/UdyamRegistration.aspx).

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS v4, Axios.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL (with an in-memory database fallback for seamless local testing without Postgres), Jest & Supertest.

## Directory Layout
```
/frontend    - React + Vite client application
/backend     - Node.js Express server + Prisma + scraping script
/docs        - Scraping schema and developmental lessons
/AGENTS.md   - Agent project goal and folder rules
```

---

## Getting Started Locally

### 1. Prerequisite Installations
Make sure you have [Node.js (v18+)](https://nodejs.org/) installed.

### 2. Backend Setup
1. Navigate into the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate the Prisma database client:
   ```bash
   npx prisma generate
   ```
4. Create a `.env` file in the `/backend` directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/udyam_db?schema=public"
   API_KEY="udyam_secret_key_123"
   ```
   *(Note: If a local PostgreSQL instance is not reachable, the server will log a warning and automatically fall back to an in-memory storage, allowing the frontend to operate completely mock-free out of the box).*

5. Boot the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend server runs on [http://localhost:5000](http://localhost:5000).

### 3. Frontend Setup
1. Open a new terminal window and navigate into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend application runs on [http://localhost:5173](http://localhost:5173).

---

## Running Scraper and Tests

### Web Scraper Script
To run the Puppeteer scraping script that extracts Step 1 fields dynamically from the live portal:
```bash
cd backend
npm run scrape
```
This writes the generated schema to `docs/udyam-schema.json`.

### Backend Jest Test Suite
To execute the automated unit and integration tests (validation rules + endpoints mock tests):
```bash
cd backend
npm run test
```

---

## Deployment Configuration

### 1. Frontend (Vercel)
The `/frontend` is fully configured for deployment on Vercel. 
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables needed:
  - `VITE_API_BASE_URL`: Live URL of the backend API (e.g., `https://udyam-backend.railway.app/api/v1/udyam`)

### 2. Backend (Railway + PostgreSQL)
The backend is dockerized and ready for Railway. 
- Deployment Method: Railway parses the `/backend/Dockerfile` automatically.
- Database: Add a PostgreSQL service in Railway; it automatically injects `DATABASE_URL`.
- Environment Variables needed:
  - `PORT`: Automatically set by Railway.
  - `API_KEY`: Static secret key to protect the `GET /:id` endpoint.

---

## Live Links (Placeholders)
- **Frontend (Vercel)**: `https://udyam-registration-clone.vercel.app`
- **Backend (Railway)**: `https://udyam-registration-backend.railway.app`