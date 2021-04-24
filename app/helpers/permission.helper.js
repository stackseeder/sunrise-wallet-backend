const utils = require('../services/utils')

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 */
const checkRolePermissions = async data => {
  return new Promise((resolve, reject) => {
    if (data.roles.indexOf(data.user.role) > -1) {
      return resolve(true)
    }
    return reject(utils.buildErrObject(401, 'UNAUTHORIZED'))
  })
}

module.exports = {
  checkRolePermissions
}
