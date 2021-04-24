const { matchedData } = require('express-validator')
const utils = require('../services/utils')
const cpService = require('../services/coinpayment')
const currenciesHelper = require('../helpers/currencies.helper')

/**
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
exports.getAllCurrencies = async (req, res) => {
  try {
    res.status(200).json(await currenciesHelper.getAllCurrencies())
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
exports.getDepositAddress = async (req, res) => {
  try {
    req = matchedData(req)
    const result = await cpService.getDepositAddress(req.currency);
    res.status(200).json(result)
  } catch (error) {
    utils.handleError(res, error)
  }
}
