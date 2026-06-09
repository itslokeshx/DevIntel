import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { FocusIndicator } from './components/a11y/FocusIndicator';
import './styles/globals.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const GitHubIntelligence = lazy(() => import('./pages/GitHubIntelligence'));
const GitHubComparison = lazy(() => import('./pages/GitHubComparison'));
const LeetCodeSkills = lazy(() => import('./pages/LeetCodeSkills'));

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-[var(--bg-primary)]">
                    <FocusIndicator />
                    <Header />
                    <Suspense fallback={
                        <div className="max-w-content mx-auto px-4 py-16 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                        </div>
                    }>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/github/:username" element={<GitHubIntelligence />} />
                            <Route path="/compare" element={<GitHubComparison />} />
                            <Route path="/leetcode/:username" element={<LeetCodeSkills />} />
                            <Route path="*" element={
                                <div className="flex items-center justify-center min-h-[60vh]">
                                    <div className="text-center">
                                        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                                            404
                                        </h1>
                                        <p className="text-sm text-[var(--text-tertiary)]">
                                            Page not found
                                        </p>
                                    </div>
                                </div>
                            } />
                        </Routes>
                    </Suspense>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
