import React from 'react';

export function Card({
    children,
    variant = 'default',
    padding = 'md',
    shadow = 'md',
    className = '',
    ...props
}) {
    const baseStyles = 'rounded-card border border-light-border dark:border-dark-border transition-all';

    const variants = {
        default: 'bg-light-bg-primary dark:bg-dark-bg-primary',
        highlight: 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary',
        subtle: 'bg-light-bg-secondary dark:bg-dark-bg-secondary'
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const shadows = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${shadows[shadow]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
