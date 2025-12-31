/**
 * Get the base API URL, ensuring it doesn't have a trailing /api
 * This prevents double /api/api in URLs
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  // Remove trailing /api if present to avoid double /api/api
  return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
}

/**
 * Construct a full API endpoint URL
 * @param endpoint - The API endpoint (e.g., '/api/auth/login' or 'auth/login')
 * @returns Full URL with proper /api prefix
 */
export function getApiEndpoint(endpoint: string): string {
  const baseUrl = getApiUrl();
  // Ensure endpoint starts with /api
  const normalizedEndpoint = endpoint.startsWith('/api') 
    ? endpoint 
    : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  return `${baseUrl}${normalizedEndpoint}`;
}

