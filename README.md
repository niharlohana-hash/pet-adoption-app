# 🐾 Pawsome Haven - Full-Stack Pet Adoption Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://mongoosejs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black.svg)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-12%2F12%20Passing-success.svg)](#running-tests)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An enterprise-ready, responsive, full-stack web application connecting rescue animals with compassionate forever families. Built with **React 18**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Socket.IO** for real-time applications and chat.

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Demo Test Accounts](#-demo-test-accounts)
3. [Architecture & System Design](#-architecture--system-design)
4. [Tech Stack](#-tech-stack)
5. [Project Structure](#-project-structure)
6. [Getting Started (Zero-Config)](#-getting-started-zero-config)
7. [Running with Docker Compose](#-running-with-docker-compose)
8. [API Documentation (Swagger & Postman)](#-api-documentation)
9. [Database Schema](#-database-schema)
10. [Automated Testing](#-automated-testing)
11. [CI/CD Pipeline](#-cicd-pipeline)
12. [Full-Stack Checklist Compliance](#-full-stack-checklist-compliance)

---

## 🌟 Key Features

### 1. Modern Responsive Frontend (React + Tailwind CSS)
- **Responsive Layout:** Pixel-perfect across Mobile, Tablet, and Desktop with mobile slide-out navigation.
- **Dark & Light Mode:** One-click toggle with system detection and `localStorage` persistence.
- **Interactive UI:** Dynamic search with custom debounce, multi-filter pill categories (Species, Gender, Size, Status, Sort), animated modal dialogs, loading skeletons, and accessible toast notifications.
- **State Management:** Clean Context API architecture (`AuthContext`, `ThemeContext`, `ToastContext`, `SocketContext`).
- **Custom React Hooks:** `useAuth`, `useDebounce`, `usePets`, `useSocket`, `useToast`.

### 2. Comprehensive RESTful API (Express + MongoDB)
- **Authentication & RBAC:** JWT authentication with bcrypt password hashing. Role-based authorization separating standard **Users** (adopters) from **Admins** (shelter managers).
- **Pet Catalog CRUD:** Search by name/breed/location, filter by species/size/gender/status, pagination, sorting.
- **Adoption Applications:** Comprehensive multi-field adoption questionnaire with applicant details, housing verification, pet experience, and personal notes.
- **Admin Dashboard:** Real-time analytics metrics, species distribution, pet inventory management (create/edit/delete), and one-click application approval/rejection with custom reviewer feedback.

### 3. Real-Time WebSockets (Socket.IO)
- **Instant Status Sync:** When an admin approves an application, the pet status switches to `Adopted` and broadcasts to all connected clients live without a page refresh.
- **Push Notifications:** Instant in-app toasts and unread count badges when an application status updates.
- **Live Shelter Chat:** Direct real-time messaging between prospective adopters and shelter caregivers with typing indicators.

---

## 🔑 Demo Test Accounts

The platform includes a pre-seeded database with verified sample accounts and realistic rescue pets:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Shelter Admin** | `admin@pawsome.org` | `Admin@123` | Full access: Add/Edit/Delete Pets, Approve/Reject Applications, View Analytics |
| **Adopter User 1** | `user@example.com` | `User@123` | Browse pets, submit adoption applications, live chat with shelter, manage profile |
| **Adopter User 2** | `liam@example.com` | `User@123` | Submit applications, chat with shelter caregivers |

> 💡 **Tip:** The Login page includes **1-Click Demo Login buttons** for instant testing!

---

## 🏗 System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (BROWSER)                          │
│   React 18  │  Tailwind CSS  │  Context API  │  Socket.IO Client       │
│   Responsive Grid  │  Dark/Light Theme  │  Real-Time Chat & Toasts    │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │
                    HTTP REST        │ WebSockets
                    (JSON / JWT)     │ (Socket.IO Events)
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                      BACKEND SERVER (Node.js/Express)                  │
│   - Security: Helmet, CORS, Morgan Logger, Express Body Parser         │
│   - Auth: JWT Verification Middleware, BCrypt Password Hashing, RBAC  │
│   - API: Pets CRUD, Applications, Real-Time Chat, Notifications, Stats │
│   - Docs: Interactive Swagger UI at /api/docs                          │
│   - WebSockets: Room-based messaging & push notification dispatcher    │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │
                             Mongoose ODM
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                         DATABASE LAYER (MongoDB)                       │
│   - Collections: Users, Pets, Applications, Messages, Notifications    │
│   - Zero-Config: Auto In-Memory MongoDB or Local / Atlas Connection   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS 3.4, React Router 6, Lucide React, Socket.IO Client.
- **Backend:** Node.js 20+, Express 4.21, Socket.IO 4.8, Mongoose 8.10, JWT, BcryptJS, Helmet, Morgan, Swagger UI Express.
- **Database:** MongoDB 7+ (with automatic zero-config `mongodb-memory-server` fallback for local dev & testing).
- **Containerization & CI/CD:** Docker, Docker Compose, NGINX Alpine, GitHub Actions.

---

## 📂 Project Structure

```
pet-adoption-app/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection with zero-config memory DB fallback
│   │   ├── controllers/     # auth, pet, application, chat, notification, stats
│   │   ├── docs/            # OpenAPI / Swagger JSON spec
│   │   ├── middleware/      # auth (JWT & RBAC), error handler, request validators
│   │   ├── models/          # User, Pet, Application, Message, Conversation, Notification
│   │   ├── routes/          # Express route definitions
│   │   ├── scripts/         # Realistic database seed script (seed.js)
│   │   ├── socket/          # Socket.IO connection & event handlers
│   │   └── server.js        # Express app & HTTP/WebSocket entry point
│   ├── tests/               # Jest & Supertest automated API tests (12 passing)
│   ├── Dockerfile           # Production container build
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Common UI (Button, Input, Modal, Badge, Toast, Navbar, Footer)
│   │   │   ├── applications/# ApplicationModal, ApplicationCard
│   │   │   ├── chat/        # Real-time ChatWidget with typing indicators
│   │   │   ├── notifications# NotificationDropdown
│   │   │   └── pets/        # PetCard, PetFilters, PetFormModal
│   │   ├── context/         # AuthContext, ThemeContext, ToastContext, SocketContext
│   │   ├── hooks/           # useAuth, useDebounce, usePets, useSocket, useToast
│   │   ├── pages/           # Home, Catalog, Detail, Login, Register, Profile, Admin, 404
│   │   ├── services/        # Centralized Fetch API client
│   │   ├── App.jsx          # Routes & global layout
│   │   └── main.jsx
│   ├── Dockerfile           # Multi-stage build with NGINX reverse proxy
│   ├── nginx.conf           # Production NGINX routing & API proxy
│   └── package.json
├── postman/                 # Ready-to-import Postman Collection v2.1.0
├── .github/workflows/       # GitHub Actions CI/CD workflow (ci.yml)
├── docker-compose.yml       # Multi-container orchestration (Backend + Frontend + Mongo)
├── PRESENTATION.md          # Comprehensive slide-by-slide project presentation
└── README.md
```

---

## 🚀 Getting Started (Zero-Config)

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone & Install Dependencies
```bash
# Navigate to the project directory
cd pet-adoption-app

# Install both backend and frontend dependencies
npm --prefix backend install
npm --prefix frontend install
```

### 2. Seed Database with Realistic Data
> **Note:** The backend automatically starts an in-memory MongoDB instance if no external `MONGO_URI` is provided, requiring **zero setup**!
```bash
npm --prefix backend run seed
```

### 3. Start Development Servers
Open two terminal tabs:

**Terminal 1 (Backend API & WebSockets):**
```bash
cd backend
npm run dev
# Server running at: http://localhost:5001
# Swagger UI at:     http://localhost:5001/api/docs
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Frontend running at: http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser!

---

## 🐳 Running with Docker Compose

To launch the complete containerized stack (MongoDB container + Backend container + Frontend NGINX container):

```bash
# From project root:
docker-compose up --build
```

- **Frontend:** `http://localhost` (Port 80)
- **Backend API:** `http://localhost:5001`
- **Swagger Documentation:** `http://localhost:5001/api/docs`
- **MongoDB Database:** `localhost:27017`

---

## 📖 API Documentation

### Interactive Swagger UI
When the backend is running, visit **`http://localhost:5001/api/docs`** to explore and execute API endpoints directly in your browser.

### Postman Collection
Import the included collection into Postman:
- File path: `postman/Pet_Adoption_API.postman_collection.json`
- Includes pre-configured requests with automated token extraction for:
  - Auth (Register, Login User, Login Admin, Get Profile)
  - Pets (Search, Species Filter, Pagination, Admin Create, Update, Delete)
  - Applications (Submit, Get My, Admin Review, Approve/Reject)
  - Chat & Real-Time (List Conversations, Send Message)
  - Notifications & Admin Analytics

---

## 🗄 Database Schema

```
┌────────────────────────┐         ┌────────────────────────┐
│          USER          │         │          PET           │
├────────────────────────┤         ├────────────────────────┤
│ _id                    │         │ _id                    │
│ name                   │◄────┐   │ name                   │
│ email (unique)         │     │   │ species [Dog, Cat...]  │
│ password (hashed)      │     │   │ breed                  │
│ role [user, admin]     │     │   │ age & ageUnit          │
│ avatar, phone, address │     │   │ gender & size          │
│ timestamps             │     │   │ photos [URL]           │
└────────────────────────┘     │   │ healthStatus           │
                               │   │ vaccinated (bool)      │
                               │   │ spayedNeutered (bool)  │
┌────────────────────────┐     │   │ adoptionFee            │
│      APPLICATION       │     │   │ status [Available...]  │
├────────────────────────┤     │   │ createdBy (ref User)   │
│ _id                    │     │   │ timestamps             │
│ pet (ref Pet)──────────┼─────┼──►└────────────────────────┘
│ applicant (ref User)───┼─────┘
│ fullName, email, phone │
│ housingType, hasYard   │
│ petExperience, reason  │
│ status [pending/app/rej]
│ reviewNotes            │
│ reviewedBy (ref User)  │
│ reviewedAt             │
└────────────────────────┘
```

---

## 🧪 Automated Testing

The backend includes a comprehensive Jest + Supertest integration test suite covering 12 critical test scenarios:
- Health check verification
- User registration and password hashing
- Login with valid vs. invalid credentials (401 Unauthorized)
- Protected route JWT token validation
- Role-based access control (Adopters forbidden from pet creation [403])
- Admin pet creation, pagination, and ID lookup
- Adoption application creation and personal retrieval
- Admin application approval with automated Pet status update to `Adopted`

To run the test suite:
```bash
cd backend
npm test
```
Result: **12 / 12 Passing** in ~2 seconds.

---

## 🔄 CI/CD Pipeline

The `.github/workflows/ci.yml` pipeline automates continuous integration on every push and pull request:
1. **Backend Test Suite:** Spawns MongoDB 7 container, installs dependencies, executes Jest test suite.
2. **Frontend Build:** Runs Vite production bundling and validates Tailwind CSS output.
3. **Docker Build Verification:** Builds production Docker images for both backend and frontend.

---

## ✅ Full-Stack Checklist Compliance

| Checklist Section | Requirement | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **1. Frontend Development** | Responsive UI (Mobile/Tablet/Desktop) | ✅ | Fully responsive with CSS Grid, Flexbox, and mobile hamburger drawer |
| | Tailwind CSS utility classes | ✅ | Tailwind CSS utility classes used exclusively across all components |
| | Dark / Light Mode | ✅ | Persisted in `localStorage`, detects OS preference |
| | Interactive UI & Modals | ✅ | Form validation, Toast system, Modal dialogs, Loading skeletons |
| | Search & Filtering | ✅ | Live debounced search, species pills, gender, size, sort dropdowns |
| **2. React Concepts** | useState, useEffect, useContext | ✅ | Used in every component; Context API for state management |
| | Custom Hooks | ✅ | `useAuth`, `useDebounce`, `usePets`, `useSocket`, `useToast` |
| **3. State Management** | Context API (Recommended) | ✅ | `AuthContext`, `ThemeContext`, `ToastContext`, `SocketContext` |
| **4. Backend REST API** | RESTful CRUD endpoints | ✅ | Complete CRUD for Pets, Applications, Auth, Chat, Notifications, Stats |
| | Proper HTTP Status Codes | ✅ | 200, 201, 400, 401, 403, 404, 500 |
| | API Documentation | ✅ | Interactive Swagger UI at `/api/docs` & Postman collection |
| **5. MongoDB + Mongoose** | Schemas, Validation, Indexes | ✅ | User, Pet, Application, Message, Notification with text indexes & relations |
| **6. Security** | Input validation, Hashing, Helmet | ✅ | `bcryptjs` password hashing, JWT tokens, Helmet headers, CORS, error middleware |
| **7. Auth & Authorization** | User & Admin RBAC | ✅ | Distinct `user` and `admin` roles, route guards, UI restrictions |
| **8. Real-Time WebSockets** | Socket.IO Live Features | ✅ | Real-time pet status updates, push notifications, live shelter chat |
| **9. Docker** | Containerization & Compose | ✅ | Dockerfiles for frontend (Nginx) & backend, `docker-compose.yml` |
| **10. DevOps & CI/CD** | GitHub Actions | ✅ | Automated build, test, and container verification workflow |
| **11. Quality & Git** | Modular code, README, Git | ✅ | Clean architecture, Git repo initialized, comprehensive documentation |
| **12. Testing** | Jest, Supertest, Postman | ✅ | 12 automated integration tests passing, Postman collection provided |
| **13. Final Deliverables** | PPT Presentation, Seed data | ✅ | `PRESENTATION.md`, seeded test accounts & realistic rescues |

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
