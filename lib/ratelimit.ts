import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client for rate limiting
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

// Only initialize if Upstash credentials are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per 60 seconds
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}

export { ratelimit };

/**
 * Rate limiting utility for API routes
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @returns Object with success boolean and remaining/reset info
 */
export async function checkRateLimit(identifier: string) {
  // If rate limiting is not configured, allow the request
  if (!ratelimit) {
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
    return { success, limit, remaining, reset };
  } catch (error) {
    // If rate limiting fails, log error and allow request (fail open)
    console.error("Rate limiting error:", error);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}
