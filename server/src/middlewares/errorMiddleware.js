const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Set CORS headers for all error responses
  const allowedOrigins = [
    "http://localhost:5173",
    "https://penportal-six.vercel.app",
    "https://penportal-6gma3hhl7-talibabbasdevexcelit-6142s-projects.vercel.app",
  ];
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Fallback for non-allowed origins
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle CORS-specific errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS error: Origin not allowed",
      error: process.env.NODE_ENV === "development" ? err.message : {},
    });
  }

  // Handle other errors
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
};

export default errorHandler;
