const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message, err.stack); // Log for debugging

  // Set CORS headers for error responses
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "https://penportal-six.vercel.app",
        "http://localhost:5173",
        "https://penportal-6gma3hhl7-talibabbasdevexcelit-6142s-projects.vercel.app",
      ];

  if (!req.headers.origin || allowedOrigins.includes(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Preserve the status code from the error (e.g., 401 from authMiddleware)
  const statusCode = err.status || res.statusCode || 500;
  res.status(statusCode).json({
    status: false,
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
    data: null,
  });
};

export default errorHandler;