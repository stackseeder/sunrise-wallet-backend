const model = require('../models/transaction.model')
const utils = require('../services/utils')
const db = require('../services/db')

/**
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query)
    res.status(200).json(await db.getItems(req, model, query))
  } catch (error) {
    utils.handleError(res, error)
  }
}
