const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

const controller = require('../controllers/currencies.ctrl')
const validator = require('../validators/currencies.validator')

/**
 * Currency Route
 */
router.get(
  '/all',
  trimRequest.all,
  controller.getAllCurrencies
)

router.get(
  '/deposit_address',
  trimRequest.all,
  validator.getDepositAddress,
  controller.getDepositAddress
)

module.exports = router
