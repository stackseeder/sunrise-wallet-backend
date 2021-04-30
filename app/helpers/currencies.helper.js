const model = require('../models/currency.model')
const utils = require('../services/utils')

// ========================================================================= //
// ============================ External functions ========================= //
// ========================================================================= //

const getAllCurrencies = async () => {
  return new Promise((resolve, reject) => {
    model.find({}, {}, {
      sort: {
        name: 1
      }
    }, (err, items) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(items)
    })
  })
}

const updateCurrency = async (condition, data) => {
  return new Promise((resolve, reject) => {
    model.updateOne(condition, data, (err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

const registerCurrencies = async (data) => {
  return new Promise((resolve, reject) => {
    model.insertMany(data, (err, items) => {
      if (err) {
        console.log(err)
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(items)
    })
  })
}

const removeCurrencies = async (condition) => {
  return new Promise((resolve, reject) => {
    model.deleteMany(condition, (err, items) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(items)
    })
  })
}

module.exports = {
  getAllCurrencies,
  registerCurrencies,
  updateCurrency,
  removeCurrencies
}
