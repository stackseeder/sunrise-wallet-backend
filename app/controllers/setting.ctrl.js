const { matchedData } = require('express-validator')
const utils = require('../services/utils')
const auth = require('../services/auth')
const settingHelper = require('../helpers/setting.helper')

/**
 * Change password function
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.changePassword = async (req, res) => {
  try {
    const id = req.user._id
    const user = await settingHelper.findUser(id)
    req = matchedData(req)
    // check password match
    const isPasswordMatch = await auth.checkPassword(req.oldPassword, user)
    if (!isPasswordMatch) {
      utils.handleError(res, await settingHelper.passwordsDoNotMatch())
    } else {
      // all ok, proceed to change password
      res.status(200).json(await settingHelper.changePasswordInDB(id, req))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
