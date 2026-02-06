import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { SkeletonCard } from './components/loading/SkeletonCard';
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
                <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
                    <FocusIndicator />
                    <Header />
                    <Suspense fallback={
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <SkeletonCard />
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
                                        <h1 className="text-h1 font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                                            404 - Page Not Found
                                        </h1>
                                        <p className="text-body text-light-text-secondary dark:text-dark-text-secondary">
                                            The page you're looking for doesn't exist.
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
