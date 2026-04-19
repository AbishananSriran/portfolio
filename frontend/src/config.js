const isDev = window.location.hostname === "localhost";

export const API_URL = isDev
  ? "http://localhost:3001"   // dev backend
  : "https://api.abi.gg";         // production backend

export const RECAPTCHA_SITE_KEY = isDev
  ? import.meta.env.VITE_RECAPTCHA_TEST_SITE_KEY
  : import.meta.env.VITE_RECAPTCHA_SITE_KEY;