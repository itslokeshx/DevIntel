import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { GitHubIntelligence } from './pages/GitHubIntelligence';
import './styles/globals.css';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/github/:username" element={<GitHubIntelligence />} />
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
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
