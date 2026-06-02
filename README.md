Markdown
# 🌐 Hyperlocal Service Marketplace

A premium, modern, and fully integrated hyperlocal service marketplace built on the **MERN Stack**. The platform dynamically matches customers with verified nearby service providers (plumbers, cleaners, electricians, etc.) using geospatial indexing. It features a high-fidelity responsive interface with dual-theme capabilities, unified analytical dashboards, and enterprise-grade Google OAuth integration.

---

## ✨ Key Features

### 👤 Customer (User) Dashboard
* **🗺️ Location-Based Discovery:** Interactive map interface targeting nearby verified providers within a strict 20km radius using precise coordinates.
* **📅 Lifecycle Booking Management:** Real-time scheduling engine with live state progression tracking (`Pending` ➔ `Scheduled` ➔ `In-Progress` ➔ `Completed`).
* **⭐ Feedback Loop:** Integrated rating and review system to maintain community accountability.

### 💼 Service Provider Dashboard
* **⚡ Live Request Dispatching:** Real-time state management allowing providers to accept or decline incoming requests instantly.
* **⏱️ Task Progression Tracker:** On-site workflow controller providing explicit time-stamped actions for `"Start Work"` and `"Complete Work"`.
* **📍 Service Radius Configuration:** Customizable operational parameters defining business coordinates, maximum coverage radius, and dynamic time slots.

### 🛡️ Admin Control Panel
* **📊 Business Intelligence Metrics:** Centralized dashboard compiling aggregated statistics for user acquisition, active provider metrics, booking density, and total gross revenue.
* **🔑 KYC & Verification Pipeline:** Administrative validation interface to audit and verify provider credentials prior to listing.
* **🛠️ Dynamic Catalog Management:** Full CRUD engine for global service categories, subcategories, and baseline configurations.

### 🔒 Security & Identity Architecture
* **🔑 Federated Identity (SSO):** Single Sign-On registration and authentication pipeline powered natively by Google Identity Services.
* **🛡️ Token Audience Verification:** Enterprise-grade backend token verification validating cryptographic claims (`aud` check) to neutralize replay and token-spoofing attacks.
* **💾 Zero-Exposure Secrets Engine:** Strict segregation of environment variables isolating client-side maps components and backend database credentials.

---

## 🎨 UI/UX Architecture & Aesthetics

* **🌓 Adaptive Theming:** Fully semantic dark and light modes styled completely via configuration layers in Tailwind CSS.
* **✨ Modern Design Tokens:** Glassmorphic layout surfaces using `backdrop-blur` components paired with structural HSL fluid color palettes.
* **🎬 Micro-Interactions:** Hardware-accelerated hover effects, layout transitions, and predictive sliding panels designed for responsive feedback.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies Used | Key Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router, Tailwind CSS | Single Page Application (SPA), state management, dynamic routing. |
| **Backend** | Node.js, Express.js, JWT, Google Auth Library | RESTful API pattern, custom authentication middleware. |
| **Database** | MongoDB Atlas, Mongoose ODM | **Geospatial Indexing** via `$nearSphere` queries and 2dsphere indexes. |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend) | Configured with explicit URL re-writes (`vercel.json`) to catch SPA asset routing. |

---

## 📂 Repository Structure

```text
hyperlocal-marketplace/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers & business logic
│   │   ├── models/        # Mongoose schemas with geospatial indexes
│   │   ├── routes/        # Express API endpoints
│   │   └── middleware/    # Auth & token validation layers
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components (Glassmorphism / Maps)
    │   ├── pages/         # Dashboard layouts (User, Provider, Admin)
    │   └── context/       # Auth and Theme State Providers
    ├── .env.example
    └── package.json
⚙️ Environment Configuration
To replicate this environment locally, create your .env configurations using the structures below:

💻 Frontend Setup (/frontend/.env)
Code snippet
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
🖥️ Backend Setup (/backend/.env)
Code snippet
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_cryptographically_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
🚀 Local Installation & Execution
Prerequisites
Node.js v18+ or higher

Active MongoDB Atlas Cluster (or local instance)

Google Cloud Console Developer Account (with Maps API and OAuth client credentials enabled)

Step-by-Step Installation
Clone the Repository:

Bash
git clone [https://github.com/yourusername/hyperlocal-service-marketplace.git](https://github.com/yourusername/hyperlocal-service-marketplace.git)
cd hyperlocal-service-marketplace
Initialize Backend Environment:

Bash
cd backend
npm install
# Create your .env file based on the environment configuration section
npm run dev
Initialize Frontend Environment:

Bash
cd ../frontend
npm install
# Create your .env file based on the environment configuration section
npm run dev
Verify Application Deployment:

Open your browser and navigate to http://localhost:5173 to interact with the web dashboard.

Verify the API is responding correctly at http://localhost:5000/api.
