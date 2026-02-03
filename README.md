<div align="center">

  <h1>🚀 DevIntel</h1>
  
  <p>
    <strong>Unlock the Story Behind the Code</strong>
  </p>

  <br />
</div>

> **DevIntel** is a premium developer intelligence platform that transforms raw **GitHub** activity into meaningful narratives. Powered by **OpenRouter AI**, it goes beyond simple stats to reveal your true developer identity.

---

## ⚡ Why DevIntel?

Most developer tools just show you numbers. We show you **insight**.

| 🔍 **Deep Analysis** | 🧠 **AI Verdicts** | ⚔️ **Comparisons** |
| :--- | :--- | :--- |
| Don't just count commits. Measure **consistency**, **impact**, and **code maturity**. | Our **Mixtral 8x7B** engine generates personalized career advice and growth plans. | **Head-to-Head battles**. Compare `torvalds` vs `gaearon` dynamically. |

---

## ✨ Features at a Glance

### 🚀 GitHub Intelligence
*   **Project X-Ray**: Health scores & maturity stages for every repo.
*   **Tech Identity**: Are you a _"Full-Stack Architect"_ or a _"Backend Ninja"_?
*   **Documentation Quality**: We analyze how well you document your code.

### ⚔️ The Arena (Comparison)
*   **AI Referee**: An objective, AI-generated verdict on who "wins" the comparison.
*   **Skill Overlap**: A Venn-diagram style view of shared technologies.

---

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js, MongoDB (Atlas), Mongoose |
| **AI Engine** | OpenRouter (Mixtral 8x7B, Mistral 7B) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```bash
DevIntel/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Environment setup
│   │   ├── controllers/     # Comparison & GitHub logic
│   │   ├── middleware/      # Rate limits & Error handling
│   │   ├── models/          # MongoDB Schemas (User, Cache)
│   │   ├── routes/          # API Endpoints
│   │   ├── services/
│   │   │   ├── ai/          # OpenRouter integration
│   │   │   └── github/      # GitHub API fetchers & analyzers
│   │   └── utils/           # Math & Helper functions
│   ├── server.js            # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/      # Reusable UI (Buttons, Cards)
    │   │   ├── comparison/  # Comparison view components
    │   │   ├── github/      # GitHub stats visualizations
    │   │   └── layout/      # Navbar, Footer
    │   ├── pages/           # Home, Comparison, Dashboard
    │   ├── services/        # Axios API client
    │   └── App.jsx
    ├── vercel.json          # Deployment config
    └── package.json
```

---

## 🌍 Live Deployment

| Component | Status | URL |
| :--- | :--- | :--- |
| **Frontend** | 🟢 Live on Vercel | [dev-intel.vercel.app](https://dev-intel.vercel.app) |
| **Backend** | 🟢 Live on Render | [devintel.onrender.com](https://devintel.onrender.com) |

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/itslokeshx/DevIntel.git
cd DevIntel
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Environment Secrets
Create a `.env` file in `backend/` with your keys:
```env
MONGODB_URI=...
GITHUB_TOKEN=...
OR_API=...
```

---

<div align="center">
  <p>Built with ❤️ by <strong>Lokesh</strong></p>
  <p>
    <a href="https://github.com/itslokeshx">GitHub</a> · 
    <a href="https://twitter.com/itslokeshx">Twitter</a>
  </p>
</div>
