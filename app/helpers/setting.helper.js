const model = require('../models/user.model')
const utils = require('../services/utils')

const { env } = require('../../config/vars')
// ========================================================================= //
// ============================ External functions ========================= //
// ========================================================================= //

/**
 * Build passwords do not match object
 */
const passwordsDoNotMatch = async () => {
  return new Promise(resolve => {
    resolve(
      utils.buildErrObject(409, [
        { param: 'oldPassword', msg: 'WRONG_PASSWORD' }
      ])
    )
  })
}

/**
 * Changes password in database
 * @param {string} id - user id
 * @param {Object} req - request object
 */
const changePasswordInDB = async (id, req) => {
  return new Promise((resolve, reject) => {
    model.findById(id, '+password', (err, user) => {
      utils.itemNotFound(err, user, reject, 'PASSWORD_CHANGE_FAILED')

      // Assigns new password to user
      user.password = req.newPassword

      // Saves in DB
      user.save(error => {
        if (error) {
          reject(utils.buildErrObject(422, error.message))
        }
        resolve(utils.buildSuccObject('PASSWORD_CHANGED'))
      })
    })
  })
}

/**
 * Builds an object with created forgot password object, if env is development
 * or testing exposes the verification
 *  * @param {Object} item - created forgot password object
 */
const resetEmailResponse = item => {
  let data = {
    msg: 'RESET_EMAIL_SENT',
    email: item.oldEmail
  }
  if (env !== 'production') {
    data = {
      ...data,
      verification: item.verification
    }
  }
  return data
}

module.exports = {
  passwordsDoNotMatch,
  changePasswordInDB,
  resetEmailResponse
}
