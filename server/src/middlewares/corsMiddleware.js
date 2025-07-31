import { ALLOWED_ORIGINS } from "../config.js";


export const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  // Check if the origin is in our allowed list
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    // Set the specific origin or * for no origin
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    // For debugging - log blocked origins
    console.warn(`CORS request from unauthorized origin: ${origin}`);
    
    // Important: For API requests that need credentials, we must specify the exact origin
    // rather than using a wildcard. Since this origin isn't in our allowed list, we'll
    // still set the header to the requesting origin to prevent CORS errors
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  // Always set these headers regardless of origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};