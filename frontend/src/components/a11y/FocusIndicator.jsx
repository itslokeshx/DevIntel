import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * FocusIndicator Component
 * Manages keyboard focus interactions and global shortcuts
 */
export function FocusIndicator() {
    const location = useLocation();

    // Reset focus on route change
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.focus();
    }, [location.pathname]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Press '/' to focus search input (if it exists)
            if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Press 'Escape' to blur focus
            if (e.key === 'Escape') {
                document.activeElement?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Add keyboard-user class for specific styling
    useEffect(() => {
        const handleTab = (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        };

        const handleMouse = () => {
            document.body.classList.remove('user-is-tabbing');
        };

        window.addEventListener('keydown', handleTab);
        window.addEventListener('mousedown', handleMouse);

        return () => {
            window.removeEventListener('keydown', handleTab);
            window.removeEventListener('mousedown', handleMouse);
        };
    }, []);

    return null; // Logic-only component
}
