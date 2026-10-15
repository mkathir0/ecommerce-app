// 404 Handler: catches requests to endpoints that do not exist
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Forwards the 404 error to the central errorHandler
};

// Central Error Handler: (err, req, res, next) - 4 arguments signify an Express error handler
const errorHandler = (err, req, res, next) => {
  // If response status is still 200, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
