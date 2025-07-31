// ./config.js

export const BASE_URL = process.env.BASE_URL



// Ensure all origins are properly formatted and unique
const uniqueOrigins = new Set(ALLOWED_ORIGINS);
console.log("Allowed origins:", [...uniqueOrigins]);

// Clear and repopulate with unique values
ALLOWED_ORIGINS.length = 0;
ALLOWED_ORIGINS.push(...uniqueOrigins);