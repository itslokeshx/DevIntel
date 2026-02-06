<div align="center">

<img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 18" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/AI-Llama_3.3_70B-FF6B6B?style=for-the-badge&logo=meta&logoColor=white" alt="Llama AI" />
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />

# 🧬 DevIntel

### Decode Your Developer DNA

**🌍 [Live Demo](https://dev-intel.vercel.app/) | 📖 [Get Started](#quick-start) | ⚔️ [Features](#features)**

_An AI-powered intelligence platform that transforms your GitHub activity into meaningful insights, personalized recommendations, and competitive analysis._

</div>

---

## 🎯 Why DevIntel?

DevIntel goes beyond simple GitHub stats. We analyze your coding patterns, project architecture, tech stack evolution, and contribution consistency to reveal your **true developer identity**.

<table>
<tr>
<td width="33%" valign="top">

### 🔬 Deep Analysis

- **Real-time GitHub data** — No caching, pure GraphQL
- **Contribution patterns** — Heatmaps, streaks, yearly trends
- **Tech Stack DNA** — Language distribution & evolution
- **Repository health** — Documentation quality, project maturity
- **Developer signature** — Unique coding archetype

</td>
<td width="33%" valign="top">

### 🧠 AI-Powered Insights

- **Llama 3.3 70B integration** — State-of-the-art AI
- **Personalized verdicts** — What makes you special?
- **Growth recommendations** — Actionable career advice
- **Streaming responses** — Real-time AI generation
- **Context-aware analysis** — Understands your journey

</td>
<td width="33%" valign="top">

### ⚔️ Battle Arena

- **Head-to-head comparisons** — Developer vs Developer
- **8 key metrics** — Commits, stars, consistency, impact
- **AI referee** — Unbiased winner declaration
- **Tech overlap Venn** — Shared & unique skills
- **Visual scorecards** — Beautiful comparison UI

</td>
</tr>
</table>

---

## ✨ Core Features

### 🚀 GitHub Intelligence Dashboard

Transform any GitHub profile into a comprehensive intelligence report:

- **🎨 Contribution Heatmap** — 52-week activity visualization with intensity timeline
- **📊 Yearly Breakdown** — Interactive charts showing evolution across years (2025-2026)
- **💼 Developer Wrapped** — Spotify-style annual summary with peak months & milestones
- **🧪 Tech Stack DNA** — Language usage with trend forecasting
- **🏆 Repository Showcase** — Ranked by stars, activity, and impact
- **📈 Developer Analysis** — 4-quadrant skill assessment (Activity, Focus, Documentation, Impact)
- **🎭 Developer Signature** — Your unique archetype (e.g., "Code Craftsman", "Rapid Prototyper")
- **💎 What Makes You Special?** — AI-generated insights revealing your strengths

### ⚔️ Developer Battle Arena

Compare two developers side-by-side with AI-powered analysis:

- **🎯 Battle Score System** — Comprehensive scoring across multiple dimensions
- **📊 Metric Comparison** — Visual bars for 8 key indicators
- **🧠 AI Verdict** — Llama AI declares the winner with reasoning
- **🔵🟣 Tech Stack Overlap** — Venn diagram visualization
- **👤 Profile Cards** — Quick stats, followers, top languages
- **🏅 Winner Declaration** — Animated reveal with confetti

### 📱 Mobile-First Design

- **🍔 Hamburger menu** with smooth animations
- **📏 Responsive layouts** from 320px to 4K
- **👆 Touch-optimized** interactions
- **🌊 Horizontal scroll** heatmaps on small screens
- **🎨 Premium aesthetics** — Calm, clean, dark-first

---

## 🛠️ Technology Stack

<div align="center">

| Layer                | Technologies                                       |
| -------------------- | -------------------------------------------------- |
| **Frontend**         | React 18 • Vite • Tailwind CSS • Framer Motion     |
| **Backend**          | Node.js • Express • MongoDB • Mongoose             |
| **AI/ML**            | Groq (Llama 3.3 70B) • Streaming Responses         |
| **Data Sources**     | GitHub GraphQL API • GitHub REST API               |
| **Visualization**    | Recharts • Custom SVG animations • Canvas Confetti |
| **State Management** | Zustand • React Context                            |
| **Styling**          | Custom Design Tokens • Dark Mode • Gradients       |
| **Deployment**       | Vercel (Frontend) • Render (Backend)               |

</div>

---

## 📁 Project Architecture

```
DevIntel/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js      # App-wide constants & scoring weights
│   │   │   └── database.js       # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── githubController.js     # Profile analysis endpoint
│   │   │   ├── comparisonController.js # Battle arena logic
│   │   │   └── leetcodeController.js   # LeetCode integration
│   │   ├── middleware/
│   │   │   ├── errorHandler.js   # Global error handling
│   │   │   └── rateLimit.js      # API rate limiting
│   │   ├── models/
│   │   │   ├── User.js           # User schema
│   │   │   ├── GitHubData.js     # Cached GitHub profiles
│   │   │   └── ComparisonCache.js # Cached battle results
│   │   ├── routes/
│   │   │   ├── github.js         # /api/github routes
│   │   │   ├── comparison.js     # /api/comparison routes
│   │   │   └── leetcode.js       # /api/leetcode routes
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── groq.js       # Groq AI client
│   │   │   │   ├── insights.js   # AI insight generation
│   │   │   │   └── prompts.js    # AI prompt templates
│   │   │   ├── github/
│   │   │   │   ├── fetcher.js    # GitHub API calls
│   │   │   │   ├── analyzer.js   # Metrics calculation
│   │   │   │   └── contributionCalendar.js # Heatmap data
│   │   │   └── cache/
│   │   │       └── kv.js         # Caching layer
│   │   └── utils/
│   │       ├── metrics.js        # Score calculations
│   │       └── dataValidator.js  # Input validation
│   ├── server.js                 # Express app entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── Loading.jsx
    │   │   │   ├── ThemeToggle.jsx
    │   │   │   └── ...
    │   │   ├── comparison/
    │   │   │   ├── BattleArenaSetup.jsx
    │   │   │   ├── StreamingAIVerdict.jsx
    │   │   │   ├── WinnerAnnouncement.jsx
    │   │   │   └── MetricsComparison.jsx
    │   │   ├── github/
    │   │   │   ├── ContributionHeatmap.jsx
    │   │   │   ├── YearlyBreakdown.jsx
    │   │   │   ├── DeveloperWrapped.jsx
    │   │   │   ├── TechStackDNA.jsx
    │   │   │   ├── DeveloperAnalysis.jsx
    │   │   │   ├── DeveloperSignature.jsx
    │   │   │   └── RepositoryShowcase.jsx
    │   │   └── layout/
    │   │       └── Header.jsx        # Navbar with mobile menu
    │   ├── pages/
    │   │   ├── Home.jsx              # Landing page
    │   │   ├── GitHubIntelligence.jsx # Profile analysis
    │   │   ├── GitHubComparison.jsx   # Battle arena
    │   │   └── LeetCodeSkills.jsx     # LeetCode analysis
    │   ├── services/
    │   │   └── api.js                # Axios API client
    │   ├── context/
    │   │   └── ThemeContext.jsx      # Dark mode state
    │   ├── store/
    │   │   └── index.js              # Zustand store
    │   ├── styles/
    │   │   └── globals.css           # Tailwind + custom styles
    │   ├── App.jsx                   # Router setup
    │   └── main.jsx                  # React DOM entry
    ├── public/
    ├── vercel.json                   # Vercel deployment config
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm/yarn
- **MongoDB** Atlas account (or local instance)
- **GitHub Personal Access Token** ([Create here](https://github.com/settings/tokens))
- **Groq API Key** ([Get free key](https://console.groq.com/))

### Installation

**1️⃣ Clone the repository**

```bash
git clone https://github.com/itslokeshx/DevIntel.git
cd DevIntel
```

**2️⃣ Backend Setup**

```bash
cd backend
npm install

# Create .env file
touch .env
```

Add these variables to `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devintel

# GitHub API
GITHUB_TOKEN=ghp_your_github_personal_access_token

# AI (Groq)
GROQ_API_KEY=gsk_your_groq_api_key

# CORS (optional, defaults to http://localhost:3000)
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm start
# Server runs on http://localhost:5000
```

**3️⃣ Frontend Setup**

```bash
cd ../frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

**4️⃣ Access the App**

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 Usage Guide

### Analyzing a GitHub Profile

1. **Enter username** in the search bar on the home page
2. **View comprehensive analysis**:
   - Contribution heatmap with 52-week history
   - AI-generated insights about your coding style
   - Tech stack breakdown with language percentages
   - Repository showcase ranked by impact
   - Yearly trends and milestones
   - Developer archetype (e.g., "Open Source Champion")

### Starting a Developer Battle

1. Navigate to **Compare** page (desktop) or open mobile menu
2. Enter **two GitHub usernames**
3. Click **"Start Battle"**
4. Watch the analysis unfold:
   - Overall battle scores with circular progress rings
   - Head-to-head metrics comparison (8 indicators)
   - AI verdict declaring the winner
   - Tech stack overlap Venn diagram
   - Winner announcement with confetti 🎉

### Key Metrics Explained

| Metric                    | Description                                | Weight |
| ------------------------- | ------------------------------------------ | ------ |
| **Developer Score**       | Overall coding activity & consistency      | 30%    |
| **Stars Earned**          | Community recognition & project popularity | 25%    |
| **Total Commits**         | Volume of contributions                    | 20%    |
| **Current Streak**        | Recent consistency                         | 10%    |
| **Impact Score**          | Code quality & project health              | 10%    |
| **Documentation Quality** | README & docs completeness                 | 5%     |

---

## 🎨 Design Philosophy

DevIntel follows a **calm, clean, premium** aesthetic:

- **Dark-first design** — Reduces eye strain for developers
- **Subtle gradients** — Blue → Purple → Pink accents
- **Smooth animations** — Framer Motion for delightful interactions
- **Custom design tokens** — Consistent spacing, colors, shadows
- **Mobile-responsive** — From 320px to 4K displays
- **Accessible** — WCAG 2.1 AA compliant color contrasts

---

## 🔧 API Endpoints

### GitHub Intelligence

```http
POST /api/github/analyze
Content-Type: application/json

{
  "username": "torvalds"
}
```

**Response:**

```json
{
  "profile": { "name": "Linus Torvalds", "bio": "...", ... },
  "contributions": { "totalCommits": 5000, "currentStreak": 12, ... },
  "repositories": [...],
  "metrics": { "devScore": 95, "languageStats": [...], ... },
  "aiInsights": { "verdict": "...", "strengths": [...], ... }
}
```

### Developer Comparison

```http
POST /api/comparison/compare
Content-Type: application/json

{
  "usernameA": "gvanrossum",
  "usernameB": "tj"
}
```

**Response:**

```json
{
  "userA": { "username": "gvanrossum", ... },
  "userB": { "username": "tj", ... },
  "comparison": {
    "totalCommits": { "userA": 8000, "userB": 12000 },
    "totalStars": { "userA": 15000, "userB": 25000 },
    "winner": "B",
    "aiInsights": { "verdict": "...", "winner": "B", "winReason": "..." }
  }
}
```

---

## 🌟 Key Features Showcase

### 1. Contribution Heatmap

- **52 weeks** of GitHub activity
- **5 intensity levels** with gradient colors
- **Horizontal scroll** on mobile
- **Hover tooltips** with commit counts
- **Activity timeline** chart showing peak weeks

### 2. AI Insights with Streaming

- **Real-time generation** with typewriter effect
- **Personalized analysis** based on coding patterns
- **Actionable recommendations** for skill growth
- **Context-aware** — understands your tech stack

### 3. Developer Wrapped

- **Spotify-style carousel** with 4 slides
- **Peak month detection** with 🔥 emoji
- **Top languages** visualization
- **Share functionality** (Twitter, LinkedIn, copy link)
- **Auto-advance** with pause on hover

### 4. Battle Score System

Comprehensive scoring algorithm:

```
Total Score = (Commits × 0.3) + (Stars × 0.25) + (Repos × 0.2) +
              (Streak × 0.1) + (Impact × 0.1) + (Docs × 0.05)
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (Prettier/ESLint)
- Write meaningful commit messages
- Add comments for complex logic
- Test on multiple screen sizes
- Ensure dark mode compatibility

---

## 🐛 Known Issues & Roadmap

### Current Limitations

- GitHub rate limits (5000 requests/hour with token)
- AI response can take 2-5 seconds for complex profiles
- Some older GitHub accounts may have incomplete data

### Upcoming Features

- 🔐 User authentication & profile saving
- 📊 LeetCode full integration
- 🏆 Global developer leaderboard
- 📈 Historical tracking (profile over time)
- 🎯 Skill recommendations based on job market
- 🌐 Multi-language support

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **GitHub GraphQL API** for comprehensive developer data
- **Groq** for lightning-fast AI inference
- **Llama 3.3 70B** by Meta for intelligent analysis
- **Vercel** for seamless frontend deployment
- **MongoDB Atlas** for reliable data storage

---

## 📬 Contact & Support

<div align="center">

## **Built with ❤️ by [Lokesh](https://github.com/itslokeshx)**

### ⭐ Star this repo if you found it helpful!

</div>
