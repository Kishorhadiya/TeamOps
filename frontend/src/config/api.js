// API Configuration
// When deployed on Vercel, set these environment variables in your Vercel Project Settings.
// In local development, they automatically fallback to localhost.

const cleanUrl = (url, fallback) => {
  const target = (url || fallback || '').trim();
  return target.replace(/\/+$/, '');
};

export const ADMIN_API = cleanUrl(
  import.meta.env.VITE_ADMIN_API_URL,
  'http://localhost:8000/api/v1'
);

export const BACKEND_API = cleanUrl(
  import.meta.env.VITE_BACKEND_API_URL,
  'http://localhost:3001/api/v1'
);

export const LEAVE_API = cleanUrl(
  import.meta.env.VITE_LEAVE_API_URL,
  'http://localhost:8000/leave'
);

if (ADMIN_API.includes('your-admin-backend') || BACKEND_API.includes('your-backend')) {
  console.warn(
    '⚠️ [TeamOps Config] Placeholder backend URL detected! Please configure real backend URLs in Vercel Environment Variables.'
  );
}

