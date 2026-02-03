import React from 'react';

export function Input({
    label,
    type = 'text',
    icon: Icon,
    error,
    helperText,
    required = false,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-small font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                    {label} {required && <span className="text-accent-error">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary">
                        <Icon size={20} />
                    </div>
                )}

                <input
                    type={type}
                    className={`
            w-full h-12 px-4 ${Icon ? 'pl-11' : ''}
            bg-light-bg-primary dark:bg-dark-bg-primary
            text-light-text-primary dark:text-dark-text-primary
            border ${error ? 'border-accent-error' : 'border-light-border dark:border-dark-border'}
            rounded-btn
            focus:outline-none focus:ring-2 focus:ring-accent-primary dark:focus:ring-accent-primary-dark
            transition-all
            ${className}
          `}
                    {...props}
                />
            </div>

            {error && (
                <p className="mt-1 text-small text-accent-error">{error}</p>
            )}

            {helperText && !error && (
                <p className="mt-1 text-small text-light-text-secondary dark:text-dark-text-secondary">{helperText}</p>
            )}
        </div>
    );
}
