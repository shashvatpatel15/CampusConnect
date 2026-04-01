# CampusConnect

## Table of Contents
- [Overview](#overview)
- [Features](#features)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend-1)
  - [Backend](#backend-1)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Endpoints Overview](#api-endpoints-overview)

---

## Overview
CampusConnect is a robust web application designed to help colleges and student organizations seamlessly manage workshops, automate student registrations, track participation, and gain insights into event performance. It features a stunning responsive user interface built using React and Tailwind CSS, communicating with a highly secure Node.js/Express backend API connected to a Firebase Firestore NoSQL database.

---

## Features

### Frontend
- **Explore Dashboard:** Overview of all upcoming validated workshops with real-time capacity tracking.
- **Workshop Management:** Full CRUD operations for Organizers (Create, View, Edit, Delete). Includes a mandatory "Pending Approval" state for newly submitted events.
- **Admin Approvals:** Dedicated administrative view allowing assigned administrators to safely Approve or Reject newly submitted workshops.
- **One-Click Registrations:** Secure and instant registration pipeline for students to book spots.
- **My Hub:** Personalized dashboard tracking upcoming vs. past registered workshops.
- **Analytics:** Detailed insights for organizers including Fill Rates, Topic Distribution, and Total Registrants visualized with beautiful pie and bar charts via Chart.js.
- **Authentication:** Secure Firebase Authentication (Email/Password & seamless Google Sign-In) tightly integrated with React Context API.
- **Responsive Design:** Completely fluid UI adapting perfectly to mobile, tablet, and desktop screens with micro-animations provided by Framer Motion.

### Backend
- **RESTful API:** Built completely with Express.js and Node.js.
- **Authentication & Authorization:** Firebase Admin token verification middleware specifically routing actions using Role-Based Access Control (Admin vs. Organizer vs. Student).
- **Concurrency & Race Conditions Safety:** Firestore Data Transactions guarantee capacities cannot be bypassed during huge registration spikes.
- **Database:** Firebase Firestore cloud database ensuring low-latency NoSQL operations.
- **Enterprise Security:** API routes proactively shielded by `express-rate-limit` (DDoS prevention), `helmet` (HTTP header security), and strict `cors` policies.

---

## Tech Stack

### Frontend
- **React:** JavaScript library for building user interfaces.
- **React Router:** For localized client-side routing.
- **Tailwind CSS:** Utility-first CSS framework for powerful styling and responsiveness.
- **React Context API:** Global state management handling Authentication.
- **Chart.js & react-chartjs-2:** Fast, clean data visualization graphics.
- **Lucide React:** Beautiful UI iconography.
- **Axios:** For making HTTP REST requests to the backend.
- **Vite:** Next-generation frontend build tooling.

### Backend
- **Node.js:** Server-side JavaScript runtime environment.
- **Express.js:** Lightweight routing web framework.
- **Firebase Admin SDK:** Server integration communicating to Google Cloud infrastructure.
- **Firebase Firestore:** Enterprise NoSQL database.
- **Security Middlewares:** `cors`, `helmet`, and `express-rate-limit`.
- **dotenv:** Securing and loading critical environment parameters.

---

## Project Structure

```text
/CampusConnect
|-- /frontend
|   |-- /node_modules
|   |-- /public
|   |-- /src
|   |   |-- /api             # API routing configuration (axios.js, firebase.js)
|   |   |-- /components      # Reusable UI elements (TopBar, RegistrationModal, WorkshopCard, etc.)
|   |   |-- /context         # React Context files (AuthContext)
|   |   |-- /hooks           # Custom data fetching hooks
|   |   |-- /pages           # App views (HomePage, AdminApprovals, Analytics, EditWorkshop, etc.)
|   |   |-- /utils           # Date formatting utility logic
|   |   |-- App.jsx          # Secure Routing Tree
|   |   |-- main.jsx         # App Entry Point
|   |   |-- styles.css       # Global component/utility definitions
|   |-- .env                 # Frontend environment variables (Vite Firebase keys)
|   |-- package.json
|   |-- tailwind.config.js
|   `-- vite.config.js
|
`-- /backend
    |-- /node_modules
    |-- /config              # Contains Firebase config logic
    |-- /controllers         # Core operation logic (Registrations, Workshops, Users)
    |-- /middlewares         # Auth token & Role checks
    |-- /routes              # Express API endpoint definitions
    |-- .env                 # Backend config (CORS port, Frontend URLs)
    |-- make-admin.js        # Script to manually promote Admin users
    |-- make-organizer.js    # Script to manually promote Organizer users
    |-- package.json
    `-- server.js            # Main backend API entry point
```

---

## Getting Started
Follow these instructions to set up and run the project locally.

### Prerequisites
- **Node.js**: v18.x or later recommended.
- **Firebase Setup**: An active Google Firebase Project (Authentication & Firestore Database initialized).

### Installation
Clone the repository:
```bash
git clone https://github.com/shashvatpatel15/CampusConnect.git
cd CampusConnect
```

Install Backend Dependencies:
```bash
cd backend
npm install
```

Install Frontend Dependencies:
```bash
cd ../frontend
npm install
```

### Environment Variables
Environment variables are securely isolated. Create `.env` files in their respective folders.

**1. Backend Credentials (`backend/.env`)**
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```
*Note: You must also obtain your Firebase Service Account JSON file from your Firebase console and save it to `backend/config/serviceAccountKey.json`*

**2. Frontend Credentials (`frontend/.env`)**
Create a `.env` file in the `/frontend` directory containing your Firebase Web App credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Running Locally

**Start the Backend Server:**
Open a designated terminal:
```bash
cd backend
npm run dev
```
The server will boot to port `5000` via `nodemon`.

**Start the Frontend Client:**
Open a new terminal window:
```bash
cd frontend
npm run dev
```
Your browser will auto-launch the UI on `http://localhost:5173`.

---

## API Endpoints Overview
The backend strictly protects these main routes via Firebase ID Tokens + RBAC.

### 📚 Workshops
- **`GET` /api/workshops**: Fetch all publicly approved workshops.
- **`POST` /api/workshops**: Create a new workshop (`pending` by default, requires Organizer role).
- **`GET` /api/workshops/:id**: Search a specific workshop.
- **`PUT`, `DELETE` /api/workshops/:id**: Modify/Drop a workshop (requires Organizer creator).
- **`GET` /api/workshops/me/organized**: Fetch exclusively organized workshops for dashboards.

### 🛡️ Admin
- **`GET` /api/workshops/admin/pending**: Retrieve queue of unverified workshops (requires Admin role).
- **`PATCH` /api/workshops/admin/:id/status**: Set state to `approved` or `rejected`.

### 📝 Registrations
- **`POST` /api/registrations**: Safely book a student into a workshop using Firestore atomic transactions.
- **`GET` /api/registrations/me**: Obtain logged-in user's personalized active registration tracking.
- **`DELETE` /api/registrations/:id**: Safely deregister from an upcoming event.

### 👤 User
- **`POST` /api/auth/signup**: Handle post-signup synchronization mapping Firebase users into Firestore Profiles.
- **`GET`, `PUT`, `DELETE` /api/users/profile**: Manage currently active student profile logic.
