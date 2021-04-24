require('../../config/passport')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const authMiddleware = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const controller = require('../controllers/transactions.ctrl')
const { roleMiddleware } = require('../middlewares/role.middleware')

/**
 * Get all items route without pagination
 */
router.get(
  '/all',
  authMiddleware,
  roleMiddleware(['admin']),
  trimRequest.all,
  controller.getAllTransactions
)

module.exports = router
