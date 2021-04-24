const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const { jwtSecret } = require('../../config/vars')
const iv = '1234567890123456' // 16 letters

module.exports = {
  /**
   * Checks is password matches
   * @param {string} password - password
   * @param {Object} user - user object
   * @returns {boolean}
   */
  async checkPassword(password, user) {
    return new Promise((resolve, reject) => {
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          reject(this.buildErrObject(422, err.message))
        }
        if (!isMatch) {
          resolve(false)
        }
        resolve(true)
      })
    })
  },

  /**
   * Encrypts text
   * @param {string} text - text to encrypt
   */
  encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, jwtSecret, iv)
    let crypted = cipher.update(text, 'utf8', 'base64')
    crypted += cipher.final('base64')
    return crypted
  },

  /**
   * Decrypts text
   * @param {string} text - text to decrypt
   */
  decrypt(text) {
    const cipher = crypto.createDecipheriv(algorithm, jwtSecret, iv)
    let decrypted = cipher.update(text, 'base64', 'utf8')
    decrypted += cipher.final('utf8')
    return decrypted
  }
}
