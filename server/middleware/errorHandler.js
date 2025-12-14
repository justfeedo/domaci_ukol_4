
const errorHandler = (err, req, res, next) => {
  // Pokud už byla odpověď odeslaná-  defaultní Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Validační chyby z express-validator
  if (err.type === 'validation') {
    return res.status(400).json({
      status: 400,
      error: {
        code: 'INVALID_DTO_IN',
        message: 'Invalid input data',
        paramMap: err.errors
      }
    });
  }

  // Vlastní chyby aplikace
  if (err.status && err.error) {
    return res.status(err.status).json({
      status: err.status,
      error: err.error
    });
  }

  // Defaultní server error - něco se pokazilo
  console.error('Error:', err);
  res.status(500).json({
    status: 500,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      paramMap: {}
    }
  });
};

module.exports = errorHandler;

