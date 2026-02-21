/**
 * API Configuration
 * Resolves the backend API base URL based on environment
 * - In development: empty string (uses Vite proxy to /api)
 * - In production: uses VITE_API_URL env variable pointing to Render backend
 */
export const API_URL = import.meta.env.VITE_API_URL || '';
