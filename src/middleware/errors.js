const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: 'Route not found' });
};

// Express recognizes error handlers by their four parameters, so `next` must stay.
const errorHandler = (error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body must be valid JSON' });
  }

  console.error('Unexpected error:', error.message);
  return res.status(500).json({ message: 'Internal server error' });
};

export { notFoundHandler, errorHandler };
