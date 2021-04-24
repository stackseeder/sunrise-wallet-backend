const jwt = require('jsonwebtoken')
const { addHours } = require('date-fns')
const uuid = require('uuid')
const User = require('../models/user.model')
const ForgotPassword = require('../models/forgotPassword.model')
const utils = require('../services/utils')
const auth = require('../services/auth')

const HOURS_TO_BLOCK = 2
const HOURS_TO_VERIFICATION = 24
const LOGIN_ATTEMPTS = 5

const { env, jwtExpiration, jwtSecret } = require('../../config/vars')

// ========================================================================= //
// ============================ Internal functions ========================= //
// ========================================================================= //

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = user => {
  // Gets expiration time
  const expiration = Math.floor(Date.now() / 1000) + 60 * jwtExpiration
  const issuedAt = Math.floor(Date.now() / 1000) - 30

  // returns signed and encrypted token
  return {
    jwt: auth.encrypt(
      jwt.sign(
        {
          data: {
            _id: user
          },
          exp: expiration,
          iat: issuedAt
        },
        jwtSecret
      )
    ),
    exp: expiration,
    iat: issuedAt
  }
}

/**
 * Checks that login attempts are greater than specified in constant and also
 * that blockexpires is less than now
 * @param {Object} user - user object
 */
const blockIsExpired = user =>
  user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date()

// ========================================================================= //
// ============================ External functions ========================= //
// ========================================================================= //

/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = req => {
  let user = {
    _id: req._id,
    firstName: req.firstName,
    middleName: req.middleName,
    lastName: req.lastName,
    email: req.email,
    role: req.role,
    verified: req.verified
  }
  // Adds verification for testing purposes
  if (env !== 'production') {
    user = {
      ...user,
      verification: req.verification,
      verificationExpires: req.verificationExpires
    }
  }
  return user
}

/**
 * Builds an object with created forgot password object, if env is development
 * or testing exposes the verification
 *  * @param {Object} item - created forgot password object
 */
const forgotPasswordResponse = item => {
  let data = {
    msg: 'RESET_EMAIL_SENT',
    email: item.email
  }
  if (env !== 'production') {
    data = {
      ...data,
      verification: item.verification
    }
  }
  return data
}

/**
 * Blocks a user by setting blockExpires to the specified date based on constant
 * HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async user => {
  return new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      if (result) {
        resolve(utils.buildErrObject(409, 'BLOCKED_USER'))
      }
    })
  })
}

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async user => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      if (result) {
        resolve(true)
      }
    })
  })
}

/**
 *
 * @param {Object} user - user object.
 */
const checkLoginAttemptsAndBlockExpires = async user => {
  return new Promise((resolve, reject) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0
      user.save((err, result) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        if (result) {
          resolve(true)
        }
      })
    } else {
      // User is not blocked, check password (normal behaviour)
      resolve(true)
    }
  })
}

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = async user => {
  return new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      reject(utils.buildErrObject(409, 'BLOCKED_USER'))
    }
    resolve(true)
  })
}

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = async email => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      'password loginAttempts blockExpires firstName lastName middleName email role verified verification companyId image freelancer',
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_NOT_FOUND')
        resolve(item)
      }
    )
  })
}

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the
 * constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns
 * blockUser function
 *  * @param {Object} user - user object
 */
const passwordsDoNotMatch = async user => {
  user.loginAttempts += 1
  await saveLoginAttemptsToDB(user)
  return new Promise(async (resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
    } else {
      resolve(await blockUser(user))
    }
    reject(utils.buildErrObject(422, 'ERROR'))
  })
}

/**
 * Check Verification
 * @param {Object} user - user object
 */
const checkVerification = async user => {
  return new Promise((resolve, reject) => {
    if (!user.verified) {
      reject(utils.buildErrObject(409, 'NOT_VERIFIED_USER'))
    }
    resolve(true)
  })
}

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveForgotPassword = async req => {
  return new Promise((resolve, reject) => {
    const forgot = new ForgotPassword({
      used: false,
      email: req.body.email,
      verification: uuid.v4(),
      verificationExpires: addHours(new Date(), HOURS_TO_VERIFICATION),
      ipRequest: utils.getIP(req),
      browserRequest: utils.getBrowserInfo(req),
      countryRequest: utils.getCountry(req)
    })
    forgot.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    const userInfo = setUserInfo(user)
    const token = generateToken(user._id)
    // Returns data with access token
    resolve({
      token: token.jwt,
      tokenExpiresIn: token.exp,
      user: userInfo
    })
  })
}
module.exports = {
  setUserInfo,
  forgotPasswordResponse,
  blockUser,
  saveLoginAttemptsToDB,
  checkLoginAttemptsAndBlockExpires,
  userIsBlocked,
  findUser,
  passwordsDoNotMatch,
  checkVerification,
  saveForgotPassword,
  saveUserAccessAndReturnToken
}
