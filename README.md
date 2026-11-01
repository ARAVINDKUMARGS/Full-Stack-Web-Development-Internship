# Full-Stack Contact Manager

> **Invexom Full Stack Web Development Internship — Final Submission Project**

A production-grade, full-stack contact management application built with the MERN stack (MongoDB, Express, React, Node.js) and Vite. Features a responsive, accessible UI, debounced server-side search, full CRUD capabilities, robust multi-layer validation, centralized error handling, and comprehensive automated test suites.

---

## Repository & Live Links

- **GitHub Repository:** `https://github.com/ARAVINDKUMARGS/Full-Stack-Web-Development-Internship`
- **Live Frontend (Vercel):** `https://<your-project>.vercel.app` *(Replace with your deployed frontend URL)*
- **Live Backend API (Render):** `https://full-stack-web-development-internship-3.onrender.com/api`

---

## Technology Stack

| Layer | Technologies | Version / Role |
|---|---|---|
| **Frontend** | React, Vite | React 18, Vite 5, Axios, CSS Modules / Modern CSS Variables |
| **Backend** | Node.js, Express.js | Node 18+, Express 4, Helmet (Security headers), Morgan (HTTP logger), CORS |
| **Database** | MongoDB & Mongoose | MongoDB 7+, Mongoose 8 (Schema validation, unique indexes, timestamps) |
| **Testing** | Node.js Test Runner | Built-in `node:test`, `node:assert`, custom automated E2E test runner |
| **Deployment** | Vercel & Render | Frontend on Vercel SPA, Backend Web Service on Render, DB on MongoDB Atlas |

---

## Features

- **Full Contact Lifecycle (CRUD)**: Create, view list, inspect details, update fields, and delete contacts with confirmation.
- **Server-Side Search**: Debounced live search querying `name`, `email`, `phone`, and `company` fields simultaneously.
- **Server-Side Pagination**: Clean pagination controls navigating results (`limit` up to 50, default 12).
- **Dual Display Layouts**: Toggle seamlessly between Grid (Card) and Table layouts with preserved state.
- **Multi-Layer Validation**:
  - Client-side pre-validation with immediate field-level error messages.
  - Server-side Mongoose schema validation for required fields, regex matching, and lengths.
  - Duplicate email detection returning HTTP `409 Conflict` (case-insensitive).
  - MongoDB ObjectId format verification returning HTTP `400 Bad Request`.
  - Nonexistent contact checks returning HTTP `404 Not Found`.
- **Accessible & Responsive UX**:
  - Mobile slide-out drawer navigation with overlay scrim and close button.
  - Floating Action Button (FAB) on small viewports.
  - Keyboard navigation (Enter / Space activation, Escape to close modals).
  - Shimmer loading skeletons and informative empty states for search and blank lists.
  - Non-blocking toast notifications for success and error feedback.

---

## Project Structure

```
contact-manager/
├── package.json                   # Root orchestrator scripts (install, test, build, dev)
├── .gitignore                     # Git ignore rules for node_modules, .env, dist, logs
├── README.md                      # Comprehensive documentation and project guide
├── backend/                       # Express REST API (MVC architecture)
│   ├── package.json               # Backend dependencies and test scripts
│   ├── server.js                  # App bootstrap: connects MongoDB and starts listener
│   ├── .env.example               # Backend environment variables template
│   ├── src/
│   │   ├── app.js                 # Express application, CORS, Helmet, routes, middleware
│   │   ├── config/
│   │   │   ├── db.js              # Mongoose connection with event listeners
│   │   │   └── env.js             # Environment variable parsing and validation
│   │   ├── controllers/
│   │   │   └── contactController.js # CRUD business logic, pagination, search
│   │   ├── middleware/
│   │   │   └── errorHandler.js    # Centralized error handler, ObjectId validator, HttpError
│   │   ├── models/
│   │   │   └── Contact.js         # Mongoose schema, validation rules, indexes
│   │   └── routes/
│   │       └── contactRoutes.js   # Route definitions for /api/contacts
│   ├── tests/
│   │   └── app.test.js            # Automated offline unit & routing test suite (11 tests)
│   └── scripts/
│       ├── api-test.js            # Cross-platform Node.js E2E test runner (18 tests)
│       └── api-test.sh            # POSIX Bash curl-based E2E test script
└── frontend/                      # React + Vite Single Page Application
    ├── package.json               # Frontend dependencies and Vite build scripts
    ├── vite.config.js             # Vite configuration with React plugin
    ├── vercel.json                # Vercel deployment configuration
    ├── index.html                 # HTML entry point with favicon and fonts
    ├── .env.example               # Frontend environment variables template
    └── src/
        ├── main.jsx               # React entry point mounting ToastProvider and App
        ├── App.jsx                # Main dashboard state: search, view, pagination, modals
        ├── styles.css             # Responsive design, theme variables, animations
        ├── api/
        │   └── contacts.js        # Axios API client, URL normalization, interceptors
        ├── components/
        │   ├── Avatar.jsx         # Dynamic color-hashed contact avatar with initials
        │   ├── ConfirmDialog.jsx  # Deletion confirmation modal
        │   ├── ContactDetails.jsx # Detailed drawer view with live fetch and skeletons
        │   ├── ContactForm.jsx    # Add/Edit form with validation and error badges
        │   ├── ContactList.jsx    # Grid and Table contact views with keyboard support
        │   ├── EmptyState.jsx     # Visual feedback for zero contacts or empty search
        │   ├── Icons.jsx          # Lightweight SVG icon collection
        │   ├── Modal.jsx          # Reusable modal wrapper with Escape key listener
        │   ├── Sidebar.jsx        # Navigation sidebar with counter pill and mobile toggle
        │   └── Skeletons.jsx      # Shimmer loading skeletons for cards and tables
        ├── context/
        │   └── ToastContext.jsx   # Global toast provider for notifications
        ├── hooks/
        │   └── useDebounce.js     # Debounce hook for smooth search input handling
        └── utils/
            ├── format.js          # Date/time formatters, avatar initials generator
            └── validation.js      # Client-side input validation mirroring schema
```

---

## Environment Configuration

Both backend and frontend require environment configuration files. Copy the example templates to create your local `.env` files.

### 1. Backend (`backend/.env`)

```bash
cd backend
cp .env.example .env
```

| Variable | Description | Example (Local) | Example (Production) |
|---|---|---|---|
| `PORT` | HTTP port for Express | `5000` | Injected automatically by Render |
| `NODE_ENV` | Runtime environment | `development` | `production` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/contact_manager` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/contact_manager?retryWrites=true&w=majority` |
| `CLIENT_URL` | Allowed CORS frontend origins | `http://localhost:5173` | `https://<your-app>.vercel.app` |

### 2. Frontend (`frontend/.env`)

```bash
cd frontend
cp .env.example .env
```

| Variable | Description | Example (Local) | Example (Production) |
|---|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` | `https://<your-service>.onrender.com/api` |

> **Security Note:** Real `.env` files are strictly excluded from Git tracking via `.gitignore`. Never commit passwords, connection strings, or private keys.

---

## Installation & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: Local MongoDB instance running on port 27017 **OR** a free MongoDB Atlas cluster URI.

### Option A: From Repository Root
```bash
# 1. Install all dependencies (both backend and frontend)
npm run install:all

# 2. Configure .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start Backend in one terminal
npm run dev:backend       # Runs API on http://localhost:5000

# 4. Start Frontend in a second terminal
npm run dev:frontend      # Runs React dashboard on http://localhost:5173
```

### Option B: Per-Service
```bash
# Backend setup
cd backend
npm install
npm run dev               # http://localhost:5000

# Frontend setup (separate terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## Database Setup (MongoDB Atlas)

To configure a cloud database for production or local use:

1. **Create Account & Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free Shared Cluster (M0).
2. **Configure Database User**:
   - Navigate to **Security** → **Database Access** → **Add New Database User**.
   - Select Password authentication, create a secure username and password, and grant **Read and write to any database**.
3. **Configure Network Access**:
   - Navigate to **Security** → **Network Access** → **Add IP Address**.
   - For local development: click **Add Current IP Address**.
   - For Render cloud deployment (dynamic IPs): add `0.0.0.0/0` (Allow Access from Anywhere).
4. **Obtain Connection String**:
   - Navigate to **Deployments** → **Database** → **Connect** → **Drivers** (Node.js).
   - Copy the URI and insert your database name `contact_manager` before the query parameter:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/contact_manager?retryWrites=true&w=majority
     ```
   - Paste into `backend/.env` as `MONGODB_URI`.

---

## API Documentation

Base URL: `http://localhost:5000/api` (or your deployed Render URL).

Standard Success Response: `{ "success": true, "data": ... }`  
Standard Error Response: `{ "success": false, "message": "...", "errors": { ... } }`

| Method | Endpoint | Description | Request Body | Success Code | Error Codes |
|---|---|---|---|---|---|
| `GET` | `/` | API Welcome & Health Link | None | `200 OK` | — |
| `GET` | `/health` or `/api/health` | Health Check | None | `200 OK` | `403` (CORS) |
| `POST` | `/api/contacts` | Create Contact | JSON contact object | `201 Created` | `400` (Validation), `409` (Duplicate Email), `413` (Too large) |
| `GET` | `/api/contacts` | List Contacts (Paginated) | Query params: `search`, `page`, `limit` | `200 OK` | `400` |
| `GET` | `/api/contacts/:id` | Get Contact Details | None | `200 OK` | `400` (Bad ID), `404` (Not Found) |
| `PUT` | `/api/contacts/:id` | Update Contact | JSON partial fields | `200 OK` | `400` (Validation), `404` (Not Found), `409` (Duplicate Email) |
| `DELETE` | `/api/contacts/:id` | Delete Contact | None | `200 OK` | `400` (Bad ID), `404` (Not Found) |

### Contact Data Model

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | String | Yes | 2 to 80 characters, trimmed |
| `email` | String | Yes | Valid email format, unique, lowercase, max 120 characters |
| `phone` | String | No | 7 to 20 characters of `+`, `(`, `)`, `-`, spaces, and digits |
| `company` | String | No | Max 100 characters, trimmed |
| `notes` | String | No | Max 500 characters, trimmed |
| `createdAt` | Date | Auto | ISO 8601 timestamp (indexed descending) |
| `updatedAt` | Date | Auto | ISO 8601 timestamp |

---

## Testing

The project includes two complementary test suites:

### 1. Offline Backend Unit & Middleware Tests (No Database Required)
Tests route mounting, health checks, 404 handlers, ObjectId validation, malformed JSON handling, payload size limits, CORS rejection/acceptance, and Mongoose schema normalization.

```bash
# Run from repository root
npm test

# Or run from backend directory
cd backend && npm test
```

**Results:** 11 / 11 tests passing.

### 2. End-to-End Integration Tests (Against Live API & Database)
Executes a complete lifecycle: health check, contact creation, duplicate email rejection (409), validation errors (400), listing with pagination, searching across all fields, fetching by ID, updating fields, rejecting bad emails, handling invalid/nonexistent IDs, deleting contact, and verifying 404 after deletion.

```bash
# Cross-platform Node.js test runner (Windows / macOS / Linux)
npm run test:e2e

# Or with custom base URL:
BASE_URL=http://localhost:5000/api npm run test:e2e
```

**Results:** 18 / 18 tests passing.

### 3. Frontend Production Build Verification
Verifies TypeScript/JSX syntax, module resolution, and production bundle size.
```bash
npm run build:frontend
```

---

## Deployment Guide

### Step 1: Push Repository to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Production-ready Contact Manager"
git remote add origin https://github.com/ARAVINDKUMARGS/Full-Stack-Web-Development-Internship.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Render
1. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name**: `contact-manager-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `<your-mongodb-atlas-uri>`
   - `CLIENT_URL` = `https://<your-frontend>.vercel.app` *(or placeholder until Step 3)*
5. Click **Create Web Service**. Verify health check at `https://<your-service>.onrender.com/api/health`.

### Step 3: Deploy Frontend to Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://<your-service>.onrender.com/api`
5. Click **Deploy**. Copy your production Vercel URL.

### Step 4: Link Frontend & Backend
Return to Render, update `CLIENT_URL` to your production Vercel URL, and trigger a redeploy so CORS permits your deployed client.

---

## Screenshots Section

> *Place application screenshots in this section before submitting.*

| View | Screenshot Placeholder |
|---|---|
| **Dashboard (Grid View)** | `![Dashboard Grid](./screenshots/dashboard-grid.png)` |
| **Dashboard (Table View)** | `![Dashboard Table](./screenshots/dashboard-table.png)` |
| **Add Contact Modal** | `![Add Contact](./screenshots/add-contact.png)` |
| **Contact Details Drawer** | `![Contact Details](./screenshots/contact-details.png)` |
| **Delete Confirmation** | `![Delete Modal](./screenshots/delete-modal.png)` |
| **Mobile Responsive View** | `![Mobile View](./screenshots/mobile-view.png)` |

---

## Known Limitations

1. **Free Tier Cold Starts**: Render web services on the free tier enter sleep mode after 15 minutes of inactivity. The initial request after spin-down may take ~30–50 seconds; the frontend displays loading skeletons and retry controls to handle this gracefully.
2. **Single Address Book Scope**: Built as a dedicated contact manager workspace as specified in the internship requirements; does not require user authentication or multi-tenant user accounts.
3. **Avatar Initials**: Avatars derive their background hue deterministically from the contact's name; custom image upload is not in scope for this version.

---

## License

This project was developed for the **Invexom Full Stack Web Development Internship**.
