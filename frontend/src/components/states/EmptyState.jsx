import React from 'react';
import { motion } from 'framer-motion';

export function EmptyState({
    icon,
    title,
    message,
    action,
    variant = 'default' // default, error, success, info
}) {
    const variantStyles = {
        default: 'text-gray-400',
        error: 'text-red-400',
        success: 'text-green-400',
        info: 'text-blue-400'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6"
        >
            {/* Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                className="text-6xl mb-4"
            >
                {icon}
            </motion.div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-2">
                {title}
            </h3>

            {/* Message */}
            <p className={`text-lg mb-6 max-w-md mx-auto ${variantStyles[variant]}`}>
                {message}
            </p>

            {/* Action button */}
            {action && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
}

// Preset empty states
export function NoRepositories({ onAction }) {
    return (
        <EmptyState
            icon="📦"
            title="No Repositories Yet"
            message="Start your coding journey by creating your first repository! Every great developer starts somewhere."
            action={
                onAction && (
                    <button
                        onClick={onAction}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all"
                    >
                        Create Your First Repo
                    </button>
                )
            }
        />
    );
}

export function NoActivity({ username }) {
    return (
        <EmptyState
            icon="🌱"
            title="No Recent Activity"
            message={`${username ? `${username} hasn't` : "You haven't"} made any commits recently. Start coding to build your developer profile!`}
            variant="info"
        />
    );
}

export function UserNotFound({ username, onRetry }) {
    return (
        <EmptyState
            icon="🔍"
            title="User Not Found"
            message={`We couldn't find the GitHub user "${username}". Please check the username and try again.`}
            variant="error"
            action={
                onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
                    >
                        Try Again
                    </button>
                )
            }
        />
    );
}

export function NetworkError({ onRetry }) {
    return (
        <EmptyState
            icon="🌐"
            title="Connection Error"
            message="We're having trouble connecting to GitHub. Please check your internet connection and try again."
            variant="error"
            action={
                onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry
                    </button>
                )
            }
        />
    );
}

export function NoComparison() {
    return (
        <EmptyState
            icon="⚔️"
            title="Ready for Battle?"
            message="Enter two GitHub usernames to see how they stack up against each other in an epic developer showdown!"
            variant="info"
        />
    );
}

export function RateLimitExceeded({ resetTime }) {
    const resetDate = resetTime ? new Date(resetTime * 1000) : null;
    const resetString = resetDate ? resetDate.toLocaleTimeString() : 'soon';

    return (
        <EmptyState
            icon="⏱️"
            title="Rate Limit Exceeded"
            message={`GitHub API rate limit reached. Please try again after ${resetString}.`}
            variant="warning"
        />
    );
}
