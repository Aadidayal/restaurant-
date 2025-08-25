// Request logging middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  
  next();
};

// Request body logging for development
const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
  }
  next();
};

module.exports = {
  logger,
  requestLogger
};
