# Project Goal
Build a high-fidelity, responsive clone of Step 1 (Aadhaar Verification) and Step 2 (PAN Verification) of the Udyam Registration form (https://udyamregistration.gov.in/UdyamRegistration.aspx).

# Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Axios (dynamic form generation, single-page 2-step wizard, no state manager).
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod validation, Jest tests.
- **Database**: PostgreSQL (Prisma ORM).
- **Testing**: Jest + Supertest (unit validation + endpoint tests).
- **Deployment**: Vercel (Frontend), Railway + PostgreSQL (Backend).

# Folder Rules
- `/frontend` - Frontend application code only.
- `/backend` - Backend application code, DB configurations, and scraping scripts.
- `/docs` - Documentation, schemas, and lessons.
- Keep folders fully separate — do not mix frontend and backend code, and do not nest one inside the other.

no scope beyond this file.
