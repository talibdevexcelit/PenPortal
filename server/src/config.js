// ./config.js

export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim()) // trim spaces like in your URLs
  .filter(Boolean); // remove empty strings

// Fallback if no env variable
if (ALLOWED_ORIGINS.length === 0) {
  ALLOWED_ORIGINS.push(
    "https://penportal-six.vercel.app",
    "http://localhost:5173",
    "https://penportal-6gma3hhl7-talibabbasdevexcelit-6142s-projects.vercel.app",
    "https://penportal-server-git-main-talibabbasdevexcelit-6142s-projects.vercel.app"
  );
}

// Ensure all origins are properly formatted and unique
const uniqueOrigins = new Set(ALLOWED_ORIGINS);
console.log("Allowed origins:", [...uniqueOrigins]);

// Clear and repopulate with unique values
ALLOWED_ORIGINS.length = 0;
ALLOWED_ORIGINS.push(...uniqueOrigins);