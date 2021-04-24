require('../../config/passport')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const authMiddleware = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const controller = require('../controllers/setting.ctrl')
const validator = require('../validators/setting.validator')

/**
 * Change password route
 */
router.post(
  '/change-password',
  authMiddleware,
  trimRequest.all,
  validator.changePassword,
  controller.changePassword
)

module.exports = router
