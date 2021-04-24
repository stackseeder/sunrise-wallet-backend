const express = require('express')
const router = express.Router()
const { env } = require('../../config/vars')

/**
 * Auth Route
 */
router.use('/auth', require('./_auth.router'))

/**
 * transactions Route
 */
router.use('/transactions', require('./_transactions.router'))

/**
 * currencies Route
 */
router.use('/currencies', require('./_currency.router'))

/**
 * Setting Route
 */
router.use('/settings', require('./_setting.router'))

/**
 * Setup routes for index
 */
router.get('/', (req, res) => {
  res.status(200).json({
    msg: 'Ok'
  })
})

if (env === 'development') {
  /**
   * Development Route
   */
  router.use('/development', require('./_development.router'))
}

/**
 * Handle 404 error
 */
router.use('*', (req, res) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND'
    }
  })
})

module.exports = router
