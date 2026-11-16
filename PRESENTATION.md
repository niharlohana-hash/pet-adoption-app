# 🐾 Pawsome Haven - Full-Stack Pet Adoption Platform
## Executive Presentation & Project Walkthrough

---

### Slide 1: Title & Overview
- **Project Name:** Pawsome Haven
- **Tagline:** Connecting Compassionate Families with Rescue Companions
- **Platform Type:** Full-Stack Web Application (SPA + REST API + WebSockets)
- **Primary Tech Stack:** React, Tailwind CSS, Node.js, Express, MongoDB, Socket.IO, Docker

---

### Slide 2: Problem Statement & Solution
#### The Problem:
- Animal shelters struggle with paper-heavy or outdated adoption application workflows.
- Prospective adopters face slow communication, unclear pet availability, and lack of real-time application updates.
- Shelters lack integrated dashboards to manage incoming inquiries, applications, and animal statuses concurrently.

#### The Solution:
- A modern, responsive web application connecting adopters directly with shelter rescue teams.
- Real-time notification system informing applicants instantly when their status changes.
- Direct live chat between prospective adopters and shelter caregivers for meet-and-greets.
- Unified administrative portal for complete pet inventory management and application review.

---

### Slide 3: User Personas & Roles
1. **Adopter (User):**
   - Discovers pets with multi-criteria filtering (Species, Gender, Size, Age, Status, Sort).
   - Submits comprehensive adoption questionnaires online.
   - Tracks application status in real-time.
   - Directly chats with shelter caregivers regarding pet quirks and visit times.
2. **Shelter Admin (Caregiver / Staff):**
   - Creates, edits, and deletes pet listings with full health and bio data.
   - Reviews incoming adoption applications with background and living arrangement details.
   - Approves or rejects applications with custom reviewer feedback notes.
   - Views high-level analytics (species breakdown, application funnel, adoption success metrics).

---

### Slide 4: System Architecture
```
┌────────────────────────────────────────────────────────┐
│                   CLIENT (BROWSER)                     │
│  React 18 + Tailwind CSS + Context API + Lucide Icons  │
└───────────────────────▲────────────────────────────────┘
                        │
         REST API (HTTP)│WebSocket (Socket.IO)
                        │
┌───────────────────────▼────────────────────────────────┐
│               BACKEND SERVER (Node/Express)            │
│  - RESTful Controllers    - JWT Authentication & RBAC  │
│  - Socket.IO Gateway      - Input Validation Middleware│
│  - Swagger OpenAPI Docs   - Security (Helmet / CORS)   │
└───────────────────────▲────────────────────────────────┘
                        │
                 Mongoose ODM
                        │
┌───────────────────────▼────────────────────────────────┐
│                   DATABASE (MongoDB)                   │
│  - Users, Pets, Applications, Messages, Notifications   │
└────────────────────────────────────────────────────────┘
```

---

### Slide 5: Frontend Architecture (React + Tailwind CSS)
- **Responsive Design:** Mobile-first layout, tablet navigation drawer, desktop widescreen grid.
- **Dark & Light Mode:** Persisted in `localStorage` with automated system preference detection.
- **Custom Hooks:**
  - `useAuth`: Global session, permissions, role helpers.
  - `useDebounce`: Live debounced search avoiding unnecessary API calls.
  - `usePets`: Encapsulates pet filtering, sorting, pagination, and real-time updates.
  - `useSocket`: Manages Socket.IO connection and notification streams.
  - `useToast`: Accessible notification system with auto-dismiss.
- **State Management:** React Context API (`AuthContext`, `ThemeContext`, `ToastContext`, `SocketContext`).

---

### Slide 6: Backend REST API Design
- **Authentication:**
  - `POST /api/auth/register` (Account creation with password hashing)
  - `POST /api/auth/login` (JWT token issuance)
  - `GET  /api/auth/me` (Profile retrieval)
- **Pet Catalog:**
  - `GET    /api/pets` (Filtering, pagination, full-text search)
  - `GET    /api/pets/:id` (Single pet profile)
  - `POST   /api/pets` (Admin create pet)
  - `PUT    /api/pets/:id` (Admin update pet)
  - `DELETE /api/pets/:id` (Admin delete pet)
- **Adoption Applications:**
  - `POST  /api/applications` (User submits application)
  - `GET   /api/applications/my` (User's personal application history)
  - `GET   /api/applications` (Admin lists applications with status filter)
  - `PATCH /api/applications/:id/status` (Admin approves/rejects + auto updates pet status)
- **Analytics & Real-time:**
  - `GET /api/stats` (Admin analytics metrics)
  - `GET /api/notifications` (User notification inbox)
  - `POST /api/chat/conversations` (Live support rooms)

---

### Slide 7: Database Schemas & Data Model
- **User Schema:** Name, unique email, bcrypt password hash (`select: false`), role (`user` | `admin`), avatar, phone, address, bio.
- **Pet Schema:** Name, species, breed, age, gender, size, photos array, description, healthStatus, vaccinated, spayedNeutered, adoptionFee, status (`Available` | `Pending` | `Adopted`), location.
- **Application Schema:** References to Pet and User, housing type, yard flag, other pets details, household members, pet experience, adoption motivation, status (`pending` | `approved` | `rejected`), reviewer notes, reviewedBy, reviewedAt.
- **Notification Schema:** Recipient reference, type, title, message, payload data, read flag.
- **Conversation & Message Schemas:** Real-time chat threads linked to pets and participants.

---

### Slide 8: Real-Time WebSockets (Socket.IO)
- **Instant Status Synchronization:** When an admin approves an application, the pet status switches to `Adopted` and broadcasts to all connected clients immediately.
- **Push Notifications:** Applicants receive push notification toast and unread badge updates without refreshing the page.
- **Live Shelter Chat:** Prospective adopters chat directly with shelter caregivers with live typing indicators and room-based privacy.

---

### Slide 9: Containerization & DevOps
- **Docker & Docker Compose:**
  - Multi-stage frontend Dockerfile with NGINX reverse proxy.
  - Alpine-based Node.js backend Dockerfile.
  - `docker-compose.yml` orchestrating MongoDB, Backend, and Frontend containers with network isolation and persistent data volumes.
- **CI/CD Pipeline (GitHub Actions):**
  - Automated linting, test suite execution with MongoDB service, frontend production build verification, and Docker image validation on every push/PR.

---

### Slide 10: Testing & Verification
- **Automated Integration Tests (Jest + Supertest):**
  - 100% test coverage across Health, Auth, Pet CRUD, and Application workflows.
- **Postman API Collection:**
  - Ready-to-import Postman Collection v2.1.0 with dynamic environment variables (`baseUrl`, `authToken`, `adminToken`).
- **Pre-seeded Dataset:**
  - Automated seeding script with realistic pets, photos, admin, adopters, and active chat logs.

---

### Slide 11: Demo Credentials & Getting Started
- **Admin Account:** `admin@pawsome.org` / `Admin@123`
- **Adopter Account:** `user@example.com` / `User@123`
- **Quick Start:**
  ```bash
  npm run install:all
  npm run seed
  npm run backend & npm run frontend
  ```
