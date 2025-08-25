// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Default error response
  let error = {
    success: false,
    message: 'Internal Server Error'
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.details = err.message;
    return res.status(400).json(error);
  }

  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    return res.status(400).json(error);
  }

  if (err.code === 11000) {
    error.message = 'Duplicate field value';
    return res.status(400).json(error);
  }

  // Send error response
  res.status(err.statusCode || 500).json(error);
};

// 404 Not Found handler
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
