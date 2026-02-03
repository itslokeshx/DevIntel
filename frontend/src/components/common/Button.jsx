import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-btn transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-accent-primary dark:bg-accent-primary-dark text-white hover:opacity-90 focus:ring-accent-primary',
        secondary: 'bg-white dark:bg-dark-bg-secondary text-accent-primary dark:text-accent-primary-dark border-2 border-accent-primary dark:border-accent-primary-dark hover:bg-accent-primary/10 dark:hover:bg-accent-primary-dark/10 focus:ring-accent-primary',
        ghost: 'text-accent-primary dark:text-accent-primary-dark hover:bg-accent-primary/10 dark:hover:bg-accent-primary-dark/10 focus:ring-accent-primary',
        danger: 'bg-accent-error text-white hover:opacity-90 focus:ring-accent-error'
    };

    const sizes = {
        sm: 'px-4 py-2 text-small',
        md: 'px-6 py-3 text-body',
        lg: 'px-8 py-4 text-h3'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
