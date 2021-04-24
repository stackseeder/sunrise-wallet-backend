const { validationResult } = require('../services/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
exports.changePassword = [
  check('oldPassword')
    .optional({ nullable: true })
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 8
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_8'),
  check('newPassword')
    .optional({ nullable: true })
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 8
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_8'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]
