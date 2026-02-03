# DevIntel - Developer Intelligence Platform

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
![GitHub Issues](https://img.shields.io/github/issues/itslokeshx/DevIntel)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/itslokeshx/DevIntel)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Unlock the story behind the code.**

[View Live Demo](https://dev-intel.vercel.app) · [Report Bug](https://github.com/itslokeshx/DevIntel/issues) · [Request Feature](https://github.com/itslokeshx/DevIntel/issues)

</div>

---

**DevIntel** goes beyond simple statistics to reveal coding patterns, growth trajectories, and true developer identity. Powered by **OpenRouter AI (Mixtral 8x7B)**, it transforms raw activity from GitHub and LeetCode into actionable career insights.

## ✨ Key Features

### 🚀 GitHub Intelligence
- **Deep Profile Analysis**: Beyond commit counts. We analyze repository quality, documentation habits, and code maturity.
- **Tech Identity**: Are you a "Full-Stack Architect" or a "Backend Specialist"? Our algorithm decides.
- **Project X-Ray**: Health scores, maturity stages, and maintenance tracking for every repo.

### ⚔️ Developer Comparison (New!)
- **Head-to-Head**: Compare two developers side-by-side (e.g., `torvalds` vs `gaearon`).
- **AI Verdict**: Get an objective, AI-generated analysis of who "wins" in different categories like Consistency, Impact, and Documentation.
- **Skill Overlap**: Visualize shared technologies and unique strengths.

### 🧩 LeetCode Analytics
- **Problem Solving Heatmaps**: Visualize your coding practice consistency.
- **Difficulty Distribution**: See your mastery across Easy/Medium/Hard problems.

### 🧠 AI-Powered Insights
- **Personalized Growth Plans**: AI suggests specific actions to improve your profile.
- **Archetype Detection**: Classifies developers into personas like "The Sprinter," "The Marathon Runner," or "The Architect."

### 🎨 Premium UI
- **Glassmorphism Design**: Modern, clean interface with blur effects and gradients.
- **Smart Theme**: Seamless Dark/Light mode support.
- **Responsive**: Fully optimized for mobile and desktop.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: CSS Transitions & Keyframes
- **Deployment**: [Vercel](https://vercel.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Atlas)
- **AI Engine**: [OpenRouter](https://openrouter.ai/) (Mixtral 8x7B / Mistral 7B)
- **Deployment**: [Render](https://render.com/)

## 🚀 Getting Started

Follow these steps to set up DevIntel locally.

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas URL)
- GitHub Personal Access Token
- OpenRouter API Key

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/itslokeshx/DevIntel.git
    cd DevIntel
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    
    # Create .env file
    cp .env.example .env
    # Add your MONGO_URI, GITHUB_TOKEN, and OR_API keys
    
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    
    # Run development server
    npm run dev
    ```

## 🔑 Environment Variables

**Backend (`backend/.env`)**
| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `GITHUB_TOKEN` | GitHub PAT for API access |
| `OR_API` | OpenRouter API Key for AI |
| `FRONTEND_URL` | URL of frontend for CORS |

**Frontend (`frontend/.env`)**
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | URL of the backend API |

## 🌍 Deployment Status

| Service | Status | Provider | URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | 🟢 Live | Vercel | [dev-intel.vercel.app](https://dev-intel.vercel.app) |
| **Backend** | 🟢 Live | Render | [devintel.onrender.com](https://devintel.onrender.com) |

## 🤝 Contributing

Contributions make the open-source community amazing!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- **GitHub API** for the incredible data.
- **OpenRouter** for democratizing AI access.
- **Render & Vercel** for free-tier hosting excellence.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/itslokeshx">Lokesh</a>
</p>
