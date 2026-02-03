# DevIntel - Developer Intelligence Platform

<p align="center">
  <h3 align="center">DevIntel</h3>
  <p align="center">
    Unlock the story behind the code.
    <br />
    <a href="https://devintel.vercel.app"><strong>View Live Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/itslokeshx/DevIntel/issues">Report Bug</a>
    ·
    <a href="https://github.com/itslokeshx/DevIntel/issues">Request Feature</a>
  </p>
</p>

DevIntel is a **premium developer intelligence platform** that transforms raw GitHub & LeetCode activity into meaningful narratives. It goes beyond simple statistics to reveal coding patterns, growth trajectories, and true developer identity using advanced AI.

## ✨ Key Features

- **🚀 GitHub Intelligence**: Deep-dive analysis of repositories, contribution habits, and code quality.
- **⚔️ Developer Comparison**: Compare two developers side-by-side with AI-driven verdicts (e.g., `torvalds` vs `gaearon`).
- **🧠 AI-Powered Insights**: Uses **OpenRouter (Mixtral 8x7B)** to generate personalized growth plans and archetypes (e.g., "The Architect", "The Sprinter").
- **🧩 LeetCode Analytics**: Visualize problem-solving skills with heatmaps and difficulty distribution charts.
- **🎨 Premium UI**: A "Glassmorphism" inspired design with seamless dark/light modes and rich data visualizations.

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** (Lightning fast build)
- **Tailwind CSS** (Utility-first styling)
- **Framer Motion** (Smooth animations)
- **Recharts** (Data visualization)

### Backend
- **Node.js** + **Express** (Robust API)
- **MongoDB** (Data persistence & caching)
- **OpenRouter API** (Access to Mixtral/Mistral AI models)
- **Memory Caching** (Optimized performance)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)
- OpenRouter API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/itslokeshx/DevIntel.git
    cd DevIntel
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env based on the example below
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

## 🔑 Environment Variables (.env)

**Backend**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_pat
OR_API=your_openrouter_api_key
GEMINI_API_KEY=optional_fallback_key
FRONTEND_URL=http://localhost:3000
```

**Frontend**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🌍 Deployment

- **Frontend**: Deployed on [Vercel](https://devintel.vercel.app)
- **Backend**: Deployed on [Render](https://devintel.onrender.com)

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">
  Built with ❤️ by <a href="https://github.com/itslokeshx">Lokesh</a>
</p>
