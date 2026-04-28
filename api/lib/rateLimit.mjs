import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

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
