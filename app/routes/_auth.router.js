require('../../config/passport')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const authMiddleware = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const controller = require('../controllers/auth.ctrl')
const validator = require('../validators/auth.validator')

/**
 * Forgot password route
 */
router.post(
  '/forgot',
  trimRequest.all,
  validator.forgotPassword,
  controller.forgotPassword
)

/**
 * Get User Info
 */
router.get('/me', authMiddleware, trimRequest.all, controller.getMe)

/**
 * Login route
 */
router.post('/login', trimRequest.all, validator.login, controller.login)

module.exports = router
