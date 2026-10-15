// Application-level middleware: logs method, URL, and timestamp for every request
const logger = (req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next(); // Hands off to the next middleware in the pipeline
};

module.exports = logger;
