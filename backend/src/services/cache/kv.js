/**
 * Cloudflare KV Cache Service
 * 
 * Provides intelligent caching for:
 * - Tier 1: GitHub API responses (5 min TTL)
 * - Tier 2: AI insights (24 hr TTL)
 * - Tier 3: Comparisons (24 hr TTL)
 */

// For now, use in-memory cache as fallback until Cloudflare KV is configured
// This can be swapped with actual KV binding when deploying to Cloudflare Workers

class CacheService {
    constructor() {
        this.memoryCache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0
        };
    }

    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {Promise<any|null>} Cached value or null
     */
    async get(key) {
        const cached = this.memoryCache.get(key);

        if (!cached) {
            this.stats.misses++;
            console.log(`[Cache MISS] ${key}`);
            return null;
        }

        // Check if expired
        if (cached.expiresAt && cached.expiresAt < Date.now()) {
            this.memoryCache.delete(key);
            this.stats.misses++;
            console.log(`[Cache EXPIRED] ${key}`);
            return null;
        }

        this.stats.hits++;
        console.log(`[Cache HIT] ${key}`);
        return cached.value;
    }

    /**
     * Set value in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttlSeconds - Time to live in seconds
     */
    async set(key, value, ttlSeconds = 300) {
        const expiresAt = Date.now() + (ttlSeconds * 1000);

        this.memoryCache.set(key, {
            value,
            expiresAt,
            createdAt: Date.now()
        });

        this.stats.sets++;
        console.log(`[Cache SET] ${key} (TTL: ${ttlSeconds}s)`);
    }

    /**
     * Delete value from cache
     * @param {string} key - Cache key
     */
    async delete(key) {
        this.memoryCache.delete(key);
        console.log(`[Cache DELETE] ${key}`);
    }

    /**
     * Clear all cache
     */
    async clear() {
        this.memoryCache.clear();
        console.log('[Cache CLEAR] All cache cleared');
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const hitRate = this.stats.hits + this.stats.misses > 0
            ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
            : 0;

        return {
            ...this.stats,
            hitRate: hitRate.toFixed(2) + '%',
            size: this.memoryCache.size
        };
    }

    /**
     * Generate cache key for GitHub profile
     */
    static githubProfileKey(username) {
        return `github:${username.toLowerCase()}:profile`;
    }

    /**
     * Generate cache key for AI insights
     */
    static aiInsightsKey(username) {
        return `ai:${username.toLowerCase()}:insights`;
    }

    /**
     * Generate cache key for comparison
     */
    static comparisonKey(userA, userB) {
        const users = [userA.toLowerCase(), userB.toLowerCase()].sort();
        return `compare:${users[0]}:${users[1]}:verdict`;
    }
}

// Singleton instance
const cacheService = new CacheService();

module.exports = cacheService;
