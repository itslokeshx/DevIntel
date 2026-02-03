import React from 'react';
import { Card } from './Card';

export function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary dark:border-accent-primary-dark"></div>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <Card>
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-3/4"></div>
                <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-1/2"></div>
                <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-5/6"></div>
            </div>
        </Card>
    );
}

export function SkeletonText({ lines = 3 }) {
    return (
        <div className="animate-pulse space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded"
                    style={{ width: `${Math.random() * 30 + 60}%` }}
                ></div>
            ))}
        </div>
    );
}
