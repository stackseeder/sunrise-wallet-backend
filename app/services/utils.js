const requestIp = require('request-ip')
const { validationResult } = require('express-validator')
const moment = require('moment-timezone')
const status = require('statuses')
const { env } = require('../../config/vars')

/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = file => {
  return file
    .split('.')
    .slice(0, -1)
    .join('.')
    .toString()
}

/**
 * Gets IP from user
 * @param {*} req - request object
 */
exports.getIP = req => requestIp.getClientIp(req)

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = req => req.headers['user-agent']

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
exports.getCountry = req =>
  req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX'

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  // Prints error in console
  if (env === 'development') {
    console.log(err)
  }
  // Sends error to user
  if (err.code && status.codes.indexOf(err.code) >= 0) {
    res.status(err.code).json({
      errors: {
        msg: err.message
      }
    })
  } else {
    res.status(500).json({
      errors: {
        msg: err.message
      }
    })
  }
}

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} next - next object
 */
exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw()
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase()
    }
    return next()
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()))
  }
}

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
  return {
    code,
    message
  }
}

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = message => {
  return {
    msg: message
  }
}

exports.isDateString = str => {
  return String(str).match(
    /^(19[5-9][0-9]|20[0-4][0-9]|2050)[-\/](0?[1-9]|1[0-2])[-\/](0?[1-9]|[12][0-9]|3[01])$/gim
  )
}

exports.isObjectID = id => {
  return String(id).match(/^[0-9a-fA-F]{24}$/)
}

/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */
exports.isIDGood = async id => {
  return new Promise((resolve, reject) => {
    const goodID = String(id).match(/^[0-9a-fA-F]{24}$/)
    return goodID
      ? resolve(id)
      : reject(this.buildErrObject(422, 'ID_MALFORMED'))
  })
}

/**
 * Checks if given ID is good for MongoDB
 * @param id1 - id1 to check
 * @param id2 - id2 to check
 */
exports.isEqualIDs = (id1, id2) => {
  if (!id1 || !id2) {
    return false
  }
  return id1.toString().toLowerCase() === id2.toString().toLowerCase()
}

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Function} reject - reject object
 * @param {String} message - message
 */
exports.itemNotFound = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message))
  }
  if (!item) {
    reject(this.buildErrObject(404, message))
  }
}

/**
 * Item already exists
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Function} reject - reject object
 * @param {String} message - message
 */
exports.itemAlreadyExists = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message))
  }
  if (item) {
    reject(this.buildErrObject(422, message))
  }
}

exports.toNLDateString = string => {
  if (string) {
    return moment.tz(new Date(string), 'Europe/Amsterdam').format('DD-MM-YYYY')
  }
  return ''
}

exports.toNLDateTimeString = string => {
  if (string) {
    return moment
      .tz(new Date(string), 'Europe/Amsterdam')
      .format('DD-MM-YYYY HH:mm:ss')
  }
  return ''
}

exports.convertDecimalNumber = (number, decimals = 2) => {
  if (number) {
    return Number(Number(number).toFixed(decimals))
  }
  return 0
}

exports.convertCurrencyString = (number, decimals = 2, currency = 'euro') => {
  if (Number(number) >= 0) {
    const str = Number(number).toFixed(decimals)
    if (str) {
      if (currency === 'euro') {
        return `€${str}`
      }
      if (currency === 'usd') {
        return `$${str}`
      }
      return str
    }
    return ''
  }
  const str = Number(Math.abs(number)).toFixed(decimals)
  if (str) {
    if (currency === 'euro') {
      return `- €${str}`
    }
    if (currency === 'usd') {
      return `- $${str}`
    }
    return str
  }
  return ''
}

/**
 *
 * @param success
 * @param msg
 */
exports.consoleLogWrapper = (success, msg) => {
  if (success) {
    console.log('*******************  Info **********************')
  } else {
    console.log('******************* Error **********************')
  }
  console.log(`>>>> ${msg}`)
  console.log('************************************************')
}
