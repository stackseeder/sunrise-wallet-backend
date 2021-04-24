const { matchedData } = require('express-validator')
const utils = require('../services/utils')
const auth = require('../services/auth')
const mailer = require('../services/mailer')
const authHelper = require('../helpers/auth.helper')

/**
 * This function is called whenever a user tries to login to the CRM system
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
exports.login = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await authHelper.findUser(data.email)
    await authHelper.userIsBlocked(user)
    await authHelper.checkLoginAttemptsAndBlockExpires(user)
    await authHelper.checkVerification(user)
    const isPasswordMatch = await auth.checkPassword(data.password, user)
    if (!isPasswordMatch) {
      utils.handleError(res, await authHelper.passwordsDoNotMatch(user))
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0
      await authHelper.saveLoginAttemptsToDB(user)
      res
        .status(200)
        .json(await authHelper.saveUserAccessAndReturnToken(req, user))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Forgot password function that is called by user whenever they forgot their password
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
exports.forgotPassword = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await authHelper.findUser(data.email)
    const item = await authHelper.saveForgotPassword(req)
    await mailer.sendResetPassword({
      firstName: user.firstName,
      lastName: user.lastName,
      ...item._doc
    })
    res.status(200).json(authHelper.forgotPasswordResponse(item))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get me
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
exports.getMe = async (req, res) => {
  try {
    const user = req.user
    res.status(200).json(authHelper.setUserInfo(user))
  } catch (error) {
    utils.handleError(res, error)
  }
}
