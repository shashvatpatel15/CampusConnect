# 🎓 CampusConnect: Workshop Management System

![React](https://img.shields.io/badge/Frontend-React-blue)
![Vite](https://img.shields.io/badge/Build-Vite-purple)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![Firebase](https://img.shields.io/badge/Database-Firebase-orange)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A **full-stack, extremely robust web application** built to streamline workshop management in colleges and organizations. **CampusConnect** enables organizers to create events securely while allowing students to discover, register, and track their participation cleanly.

Built for high-concurrency environments, it features robust **Firebase Authentication** alongside **Role-Based Access Control**, real-time NoSQL syncing, and highly aggressive race-condition protections using **Firestore Data Transactions**.

---

## ✨ Enterprise-Grade Features

### 👨‍🎓 Student / Colleague Features
* Discover dynamically populated upcoming workshops
* Browse using beautiful grid/list sorting with visually stunning modern gradients
* Quick one-click registration logic
* **My Hub:** View & track current/past registered events
* Auto-syncing Google Sign-in alongside traditional Email/Password authentication

### 🧑‍🏫 Organizer Features
* **Create Workshops:** Rich details including custom capacities, dates, times, and tagging.
* **Organized Hub:** Full control over your created workshops
* View an active roster of registrants and export capacities
* Rich analytical charts powered by Custom Chart.js integrations outlining Fill Rates & Popularity Tracking
* *Note: Newly created workshops are placed under a Pending Approval state until verified.*

### 🛡️ Admin & Security Features
* **Dedicated Admin Dashboard:** Specialized queue to swiftly Approve or Reject pending workshops created by organizers.
* **Concurrency Safe:** Hardened backend utilizes Firestore Database Transactions so 100 students registering at the exact same millisecond will **never** surpass capacity limits.
* **Secure Middleware:** Role-Based Access checking interceptors.
* **Rate Limited & Helmet Shielded:** Prevents IP spam, brute force abuse, and safeguards HTTP headers out of the box.

---

## 🛠 Tech Stack

### Frontend Architecture
* **React 18** (via Vite)
* **Tailwind CSS** (Completely responsive out-of-the-box!)
* **React Router Dom** 
* **Framer Motion** (Micro-animations and layout transitions)
* **Chart.js / React-Chartjs-2**
* **Firebase Auth API** (Google & Email/Password Sign-In)

### Backend Architecture
* **Node.js** + **Express.js** API
* **Firebase Admin SDK** 
* **Express Rate Limit** 
* **Helmet** 
* **CORS & Dotenv**

### Database Layer
* **Firebase Firestore** (Strict NoSQL cloud database setup with Data Transactions)

---

## 🚀 Local Development Setup

Follow these exact steps to clone the application and run it locally:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/shashvatpatel15/CampusConnect.git
cd CampusConnect
```

### 2️⃣ Firebase Setup & Credentials
This project completely relies on standard Firebase infrastructure. 

#### Backend (Admin SDK)
1. Go to your Firebase Console -> Project Settings -> Service Accounts.
2. Click **Generate new private key**.
3. Download the JSON file, rename it to `serviceAccountKey.json`, and place it in the following directory:
   👉 `backend/config/serviceAccountKey.json`

#### Frontend (Client Config)
1. In your Firebase Console, navigate to Project Settings -> General.
2. Copy your Web App config credentials.
3. Create a `.env` file inside the `frontend/` directory formatted like this:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3️⃣ Backend Environment Setup
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4️⃣ Install Dependencies & Run
Split your terminal to run both the frontend and backend servers.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
# Server should boot on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
# Local app should open on http://localhost:5173
```

---

## 🔑 Activating Organizer & Admin Roles

By default, any new user who signs up natively or through Google signs in as a normal **Student**. To test Organizer and Admin functionality, run the designated scripts securely tracked within the Backend CLI.

Make sure your backend server is stopped safely, or open a third terminal inside the `backend/` directory:

**To grant a user Organizer Privileges:**
```bash
node make-organizer.js
# Enter the user's email address
```

**To grant a user Admin Privileges:**
```bash
node make-admin.js
# Enter the user's email address
```
*Note: Ensure the target user has already created a standard account through the frontend before running these scripts! Refresh the frontend page to see the role take effect.*

---

## 📄 License
This brilliant repository is licensed under the **MIT License**. Use and alter responsibly!
