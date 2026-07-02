# 🇮🇳 Udyam Registration Verification Clone

> A high-fidelity, responsive full-stack clone of **Step 1 (Aadhaar Verification with simulated OTP)** and **Step 2 (PAN Verification)** of the official Indian Government MSME Udyam Registration Portal.

---

## 🚀 Technology Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
<br/>
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## 📂 Repository Layout

```
├── /frontend      # Vite + React + TypeScript + Tailwind CSS v4 Client
├── /backend       # Node.js + Express + Prisma ORM + Puppeteer Scraper API
├── /docs          # Scraped schema and developer learnings (LESSONS.md)
├── AGENTS.md      # Goal rules and scope definitions
├── README.md      # Project setup and documentation
├── SchemaDiagram.jpeg  # Database Schema Design Diagram
└── prompt.txt     # Professor requirements prompt
```

---

## 📊 Database Schema Design

The database schema matches the fields scraped from the Udyam portal dynamically. 

- **Diagram File**: You can view the schema mapping diagram at [SchemaDiagram.jpeg](file:///c:/Users/Sarvesh/Desktop/3rd%20Year/Bootcamp/Openbiz_Assignment/SchemaDiagram.jpeg).
- **Prisma Schema definition**: Lives at [schema.prisma](file:///c:/Users/Sarvesh/Desktop/3rd%20Year/Bootcamp/Openbiz_Assignment/backend/prisma/schema.prisma).

---

## 📸 Verification Flow Screenshots

### Step 1: Aadhaar Verification (Form Initial)
![Step 1 - Aadhaar Verification](docs/screenshots/step1-aadhaar.png)

### Step 1.1: Aadhaar OTP Verification (Simulated OTP Code: 123456)
![Step 1.1 - OTP Validation](docs/screenshots/step1-otp.png)

### Step 2: PAN Verification (Form Initial)
![Step 2 - PAN Verification](docs/screenshots/step2-pan.png)

### Step 2.1: PAN Verification (Validated & Form Submitted)
![Step 2.1 - Submission Completed](docs/screenshots/step2-filled.png)

---

## ⚙️ Setup & Local Development

### 1. Backend Server Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Initialize the Prisma client:
   ```bash
   npx prisma generate
   ```
4. Create a `.env` file inside `/backend`:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/udyam_db?schema=public"
   API_KEY="udyam_secret_key_123"
   ```
   *💡 Note: If a local PostgreSQL server is not running on port 5432, the server automatically boots in **in-memory database fallback mode** to allow 100% of the verification flows and query lookups to work locally without a DB.*
5. Boot the server:
   ```bash
   npm run dev
   ```
   Runs at [http://localhost:5000](http://localhost:5000).

### 2. Frontend client Setup
1. Navigate into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite React app:
   ```bash
   npm run dev
   ```
   Runs at [http://localhost:5173](http://localhost:5173).

---

## 🔍 Automated Testing & Scraping

### Puppeteer Scraper Script
Extracts the dynamic form attributes (names, placeholders, constraints, regex) straight from the live portal:
```bash
cd backend
npm run scrape
```
Saves output schema to [udyam-schema.json](file:///c:/Users/Sarvesh/Desktop/3rd%20Year/Bootcamp/Openbiz_Assignment/docs/udyam-schema.json).

### Running Test Suite
Execute Jest unit checks on regex formats and Supertest endpoint controllers:
```bash
cd backend
npm run test
```

---

## ☁️ Deployment Configurations

| Component | Target Hosting | Build Commands / Configurations |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | Uses default Vite configuration, outputs static `dist/`. Env variables: `VITE_API_BASE_URL` |
| **Backend** | **Railway** | Railway automatically detects `/backend/Dockerfile` and provisions PostgreSQL. Env variables: `PORT`, `DATABASE_URL`, `API_KEY` |