const utils = require('../services/utils')
const { checkRolePermissions } = require('../helpers/permission.helper')

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
exports.roleMiddleware = roles => async (req, res, next) => {
  try {
    const data = {
      user: req.user,
      roles
    }
    await checkRolePermissions(data)
    return next()
  } catch (error) {
    utils.handleError(res, error)
  }
}
