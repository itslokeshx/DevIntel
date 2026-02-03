# DevIntel - GitHub Developer Intelligence Platform

Transform raw GitHub activity into meaningful insights, growth patterns, and actionable recommendations.

## 🎯 Features

- **GitHub Intelligence**: Deep analysis of developer profiles, repositories, and contribution patterns
- **AI-Powered Insights**: Google Gemini generates personalized insights and recommendations
- **Developer Metrics**: Dev Score, Consistency Score, Impact Score, and more
- **Project X-Ray**: Health scores, maturity stages, and documentation quality for each repository
- **Growth Actions**: Actionable recommendations to improve your developer profile
- **Beautiful UI**: Premium design with light/dark theme support

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **MongoDB** - Database with Mongoose ODM
- **GitHub API** - Fetch user and repository data
- **Google Gemini AI** - Generate insights and recommendations
- **Axios** - HTTP client for API calls

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with custom design system
- **React Router** - Client-side routing
- **Lucide React** - Premium icon library
- **Recharts** - Data visualization (future)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- GitHub Personal Access Token ([Get one here](https://github.com/settings/tokens))
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd DevIntel
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your API keys:
# - GITHUB_TOKEN=your_github_token
# - GEMINI_API_KEY=your_gemini_api_key
# - MONGODB_URI=mongodb://localhost:27017/devintel
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the Application**

In separate terminals:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Usage

1. **Analyze a GitHub Profile**
   - Enter a GitHub username on the home page
   - Click "Analyze with DevIntel"
   - View comprehensive intelligence report

2. **Explore Insights**
   - Dev Score, Consistency, and Impact metrics
   - AI-generated one-line insight
   - Repository health scores and maturity stages
   - Growth action recommendations

3. **Refresh Data**
   - Click "Refresh Data" to force re-analysis
   - Data is cached for 7 days by default

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/devintel
GITHUB_TOKEN=your_github_personal_access_token
GEMINI_API_KEY=your_gemini_api_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL_SECONDS=604800
FRONTEND_URL=http://localhost:3000
```

## 📁 Project Structure

```
DevIntel/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── services/        # GitHub & AI services
│   │   ├── controllers/     # API controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   ├── server.js            # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── context/         # React context
    │   ├── hooks/           # Custom hooks
    │   ├── services/        # API service
    │   └── styles/          # Global styles
    ├── index.html
    └── package.json
```

## 🎨 Design Philosophy

- **Ultra Clean**: Apple-level minimalism, generous white space
- **Intelligence over Statistics**: Show patterns, not just numbers
- **GitHub-First**: 70% weight on GitHub activity
- **AI as Interpreter**: AI explains data, never collects it
- **Premium Minimalism**: Professional, not playful

## 🔒 Privacy & Security

- **Public Data Only**: Analyzes only public GitHub activity
- **No Authentication Required**: No user login needed
- **Rate Limited**: 100 requests per 15 minutes per IP
- **Cached Data**: Results cached for 7 days to reduce API calls

## 🚧 Roadmap

### Phase 1 (MVP) ✅
- [x] GitHub Intelligence page
- [x] Basic metrics and insights
- [x] AI-powered recommendations
- [x] Light/dark theme
- [x] Responsive design

### Phase 2 (Future)
- [ ] LeetCode integration
- [ ] Codeforces integration
- [ ] DEV Community integration
- [ ] GitHub Comparison page
- [ ] Unified Profile page
- [ ] Export to PDF

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or building your own tools!

## 🙏 Acknowledgments

- GitHub API for developer data
- Google Gemini for AI insights
- The open-source community

---

Built with ❤️ for developers, by developers
