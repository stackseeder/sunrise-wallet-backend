const EmailHistory = require('../models/emailHistory.model')
const utils = require('../services/utils')

// ========================================================================= //
// ============================ External functions ========================= //
// ========================================================================= //

/**
 * Saves a new user access and then returns token
 * @param {string} from
 * @param {string} to
 * @param {string} subject
 * @param {string} status
 */
const saveEmailHistory = async (from, to, subject, status) => {
  return new Promise((resolve, reject) => {
    const emailHistory = new EmailHistory({
      from,
      to,
      subject,
      status
    })
    emailHistory.save((err, item) => {
      utils.itemNotFound(err, item, reject, 'EMAIL_HISTORY_NOT_SAVED')
      resolve(item)
    })
  })
}

module.exports = {
  saveEmailHistory
}
