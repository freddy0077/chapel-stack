/**
 * Utility functions for URL handling and transformation
 */

/**
 * Get the API base URL from environment variables
 */
export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";
};

/**
 * Transform a localhost URL to use the proper base URL
 * This is useful when the backend returns localhost URLs that need to be accessible from the frontend
 */
export const transformLocalhostUrl = (url: string): string => {
  if (!url) return url;
  
  const apiBaseUrl = getApiBaseUrl();
  
  // If the URL already uses the correct base URL, return as is
  if (url.startsWith(apiBaseUrl)) {
    return url;
  }
  
  // If the URL starts with localhost, replace it with the proper base URL
  if (url.includes('localhost:3003')) {
    return url.replace(/https?:\/\/localhost:3003/, apiBaseUrl);
  }
  
  // If the URL is a relative path starting with /graphql or /api, prepend the base URL
  if (url.startsWith('/graphql') || url.startsWith('/api') || url.startsWith('/uploads') || url.startsWith('/downloads')) {
    return `${apiBaseUrl}${url}`;
  }
  
  // Return the original URL if no transformation is needed
  return url;
};

/**
 * Ensure a URL is absolute by prepending the API base URL if needed
 */
export const ensureAbsoluteUrl = (url: string): string => {
  if (!url) return url;
  
  // If already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return transformLocalhostUrl(url);
  }
  
  // If relative, make it absolute
  const apiBaseUrl = getApiBaseUrl();
  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
