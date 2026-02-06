/**
 * Data Validation Utility
 * Ensures all metrics are real, valid, and properly formatted
 */

/**
 * Validate user analysis data
 * @param {Object} data - User analysis data
 * @returns {Object} - { valid: boolean, errors: string[], sanitized: Object }
 */
function validateMetrics(data) {
    const errors = [];

    // Check for null/undefined
    if (!data || typeof data !== 'object') {
        errors.push('Invalid data object');
        return {
            valid: false,
            errors,
            sanitized: null
        };
    }

    // Validate numeric fields
    const numericFields = [
        'totalCommits',
        'totalStars',
        'devScore',
        'longestStreak',
        'currentStreak',
        'averageCommitsPerDay'
    ];

    numericFields.forEach(field => {
        const value = getNestedValue(data, field);
        if (value !== undefined && value !== null) {
            if (typeof value !== 'number' || isNaN(value)) {
                errors.push(`Invalid ${field}: ${value} (type: ${typeof value})`);
            }
            if (value < 0) {
                errors.push(`Negative ${field}: ${value}`);
            }
        }
    });

    // Validate arrays
    if (data.repositories && !Array.isArray(data.repositories)) {
        errors.push('repositories must be an array');
    }

    // Validate language stats
    if (data.languages) {
        Object.entries(data.languages).forEach(([lang, percentage]) => {
            if (typeof percentage !== 'number' || isNaN(percentage)) {
                errors.push(`Invalid language percentage for ${lang}: ${percentage}`);
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors,
        sanitized: sanitizeData(data)
    };
}

/**
 * Get nested value from object
 * @param {Object} obj - Object to search
 * @param {string} path - Dot-separated path (e.g., 'contributions.totalCommits')
 */
function getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
        if (value && typeof value === 'object') {
            value = value[key];
        } else {
            return undefined;
        }
    }
    return value;
}

/**
 * Remove placeholder/fake values and sanitize data
 * @param {Object} data - Raw data
 * @returns {Object} - Sanitized data
 */
function sanitizeData(data) {
    if (!data) return null;

    const sanitized = JSON.parse(JSON.stringify(data)); // Deep clone

    // Recursively sanitize all values
    function sanitizeValue(obj) {
        if (!obj || typeof obj !== 'object') return obj;

        Object.keys(obj).forEach(key => {
            const value = obj[key];

            // Replace NaN with 0
            if (typeof value === 'number' && isNaN(value)) {
                console.warn(`⚠️ Replacing NaN with 0 for field: ${key}`);
                obj[key] = 0;
            }

            // Replace negative values with 0 for certain fields
            if (typeof value === 'number' && value < 0) {
                const allowNegative = ['latitude', 'longitude', 'timezone'];
                if (!allowNegative.includes(key)) {
                    console.warn(`⚠️ Replacing negative value with 0 for field: ${key}`);
                    obj[key] = 0;
                }
            }

            // Recursively sanitize nested objects
            if (typeof value === 'object' && value !== null) {
                sanitizeValue(value);
            }
        });

        return obj;
    }

    return sanitizeValue(sanitized);
}

/**
 * Validate comparison data
 * @param {Object} comparison - Comparison result
 * @returns {Object} - Validation result
 */
function validateComparison(comparison) {
    const errors = [];

    if (!comparison) {
        errors.push('Comparison data is null or undefined');
        return { valid: false, errors, sanitized: null };
    }

    // Validate comparison metrics
    const requiredFields = ['devScore', 'totalCommits', 'totalStars', 'totalRepos'];
    requiredFields.forEach(field => {
        if (!comparison[field]) {
            errors.push(`Missing comparison field: ${field}`);
        } else {
            ['userA', 'userB', 'winner'].forEach(subField => {
                if (comparison[field][subField] === undefined) {
                    errors.push(`Missing ${field}.${subField}`);
                }
            });
        }
    });

    return {
        valid: errors.length === 0,
        errors,
        sanitized: sanitizeData(comparison)
    };
}

/**
 * Validate year-wise breakdown data
 * @param {Object} yearData - Year-wise breakdown
 * @returns {Object} - Validation result
 */
function validateYearBreakdown(yearData) {
    const errors = [];

    if (!yearData || typeof yearData !== 'object') {
        return { valid: true, errors: [], sanitized: {} }; // Empty is valid
    }

    Object.entries(yearData).forEach(([year, data]) => {
        // Validate year is a valid number
        const yearNum = parseInt(year);
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
            errors.push(`Invalid year: ${year}`);
        }

        // Validate year data
        if (data.commits !== undefined && (typeof data.commits !== 'number' || isNaN(data.commits))) {
            errors.push(`Invalid commits for year ${year}: ${data.commits}`);
        }

        if (data.repos !== undefined && (typeof data.repos !== 'number' || isNaN(data.repos))) {
            errors.push(`Invalid repos for year ${year}: ${data.repos}`);
        }
    });

    return {
        valid: errors.length === 0,
        errors,
        sanitized: sanitizeData(yearData)
    };
}

module.exports = {
    validateMetrics,
    validateComparison,
    validateYearBreakdown,
    sanitizeData
};
