// ./middlewares/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message, err.stack);

  const statusCode = err.status || res.statusCode || 500;
  res.status(statusCode).json({
    status: false,
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
    data: null,
  });
};

export default errorHandler;