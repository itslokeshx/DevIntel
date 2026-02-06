import React from 'react';

export function ShimmerEffect({ className = '', style = {} }) {
    return (
        <div
            className={`absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none ${className}`}
            style={style}
        />
    );
}

export function ShimmerWrapper({ children, isLoading = true, className = '' }) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {children}
            {isLoading && <ShimmerEffect />}
        </div>
    );
}
