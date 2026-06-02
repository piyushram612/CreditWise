import { NextRequest } from 'next/server';

/**
 * Get client identifier for rate limiting
 * Prioritizes user ID, falls back to IP address
 */
export function getClientIdentifier(req: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from headers (works with Vercel, Cloudflare, etc.)
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * Sanitize error messages to prevent information disclosure
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'production') {
      return 'An error occurred while processing your request.';
    }
    return error.message;
  }
  return 'An unexpected error occurred.';
}

/**
 * Validate and sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Trim and limit length
  let sanitized = input.trim().substring(0, maxLength);
  
  // Remove any potential SQL injection patterns (defense in depth)
  // Note: Supabase already protects against SQL injection, but this adds an extra layer
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(--|;|\/\*|\*\/|xp_|sp_)/gi,
  ];
  
  for (const pattern of dangerousPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }
  
  return sanitized;
}

/**
 * Check if request is from an authenticated user
 */
export function requireAuth(userId: string | null | undefined): boolean {
  return !!userId;
}
