import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

if (!redis) {
    // Fail-open is intentional (a Redis outage must not take down the forms), but a
    // permanently missing config silently removes all rate limiting. Make that visible.
    console.warn(
        '[rateLimit] UPSTASH_REDIS_REST_URL is not set - rate limiting is DISABLED (fail-open). ' +
        'Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable it.'
    );
}

export function createRateLimiter(limit, window) {
    if (!redis) return null;
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, window),
    });
}

export async function checkRateLimit(limiter, identifier) {
    if (!limiter) return { success: true };
    return limiter.limit(identifier);
}
