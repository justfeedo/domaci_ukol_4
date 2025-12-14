const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach(error => {
      formattedErrors[error.param] = error.msg;
    });

    return res.status(400).json({
      status: 400,
      error: {
        code: 'INVALID_DTO_IN',
        message: 'Validation failed',
        paramMap: formattedErrors
      },
      dtoIn: req.body // Vrátíme přijatá vstupní data
    });
  }

  next();
};

module.exports = validate;

