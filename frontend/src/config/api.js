// API Configuration
// When deployed on Vercel, set these environment variables in your Vercel Project Settings.
// In local development, they automatically fallback to localhost.

export const ADMIN_API =
  import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8000/api/v1';

export const BACKEND_API =
  import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001/api/v1';

export const LEAVE_API =
  import.meta.env.VITE_LEAVE_API_URL || 'http://localhost:8000/leave';
