const { validationResult } = require('../services/utils')
const { check } = require('express-validator')

/**
 * Validates register request
 */
exports.getDepositAddress = [
  check('currency')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
