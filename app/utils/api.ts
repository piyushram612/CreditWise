'use client';

import { isNativeApp } from './capacitor';

/**
 * Get the base URL for API calls
 * In native app, use the full Vercel URL
 * In web app, use relative URLs
 */
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'https://creditwise-omega.vercel.app';
  }

  // If running in native app or localhost, use full URL
  if (isNativeApp() || window.location.origin.includes('localhost')) {
    return 'https://creditwise-omega.vercel.app';
  }

  // For web app, use relative URLs
  return window.location.origin;
};

/**
 * Make an API call with proper URL handling
 */
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
};