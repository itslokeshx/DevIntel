import React from 'react';
import { motion } from 'framer-motion';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('❌ Error caught by boundary:', error, errorInfo);
        this.setState({ errorInfo });

        // Log to error tracking service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl w-full"
                    >
                        <div className="bg-gray-900 rounded-2xl p-8 border border-red-500/20">
                            {/* Error icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', bounce: 0.5 }}
                                className="text-center mb-6"
                            >
                                <div className="text-8xl mb-4">⚠️</div>
                                <h1 className="text-4xl font-black text-white mb-2">
                                    Oops! Something Went Wrong
                                </h1>
                                <p className="text-gray-400 text-lg">
                                    We're sorry for the inconvenience. An unexpected error occurred.
                                </p>
                            </motion.div>

                            {/* Error details (development only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-6 bg-red-950/30 border border-red-500/30 rounded-lg p-4 overflow-auto"
                                >
                                    <div className="text-red-400 font-mono text-sm">
                                        <div className="font-bold mb-2">Error Details:</div>
                                        <div className="text-red-300">{this.state.error.toString()}</div>
                                        {this.state.errorInfo && (
                                            <details className="mt-2">
                                                <summary className="cursor-pointer text-red-400 hover:text-red-300">
                                                    Stack Trace
                                                </summary>
                                                <pre className="mt-2 text-xs whitespace-pre-wrap">
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Action buttons */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <button
                                    onClick={this.handleReset}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh Page
                                </button>
                                <button
                                    onClick={this.handleGoHome}
                                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Go Home
                                </button>
                            </motion.div>

                            {/* Help text */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-center text-gray-500 text-sm mt-6"
                            >
                                If this problem persists, please contact support or try again later.
                            </motion.p>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional wrapper for easier use
export function withErrorBoundary(Component) {
    return function WrappedComponent(props) {
        return (
            <ErrorBoundary>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}
