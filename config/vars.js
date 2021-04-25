const path = require('path')

// import .env variables
require('dotenv-safe').config({
  allowEmptyValues: true,
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example')
})

const whitelist = [
  'https://sunriseshackcrypto.com',
  'https://www.sunriseshackcrypto.com',
  'http://sunriseshackcrypto.com',
  'http://www.sunriseshackcrypto.com',
]

if (process.env.NODE_ENV === 'development') {
  whitelist.push('http://localhost:8080')
  whitelist.push('http://localhost:3000')
}

const corsOptions = {
  origin(origin, callback) {
    // allow requests with no origin
    if (!origin) {
      return callback(null, true)
    }
    if (whitelist.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access.`
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  }
}

const bodyParseJson = {
  limit: '20mb'
}

const bodyParseUrlencoded = {
  limit: '20mb',
  extended: true
}

const il8nConfigure = {
  locales: ['en', 'nl'],
  directory: `${__dirname}/../locales`,
  defaultLocale: 'en',
  objectNotation: true
}
// eslint-disable-next-line
const sockets = new Map()

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000, // Setup express server port from ENV, default: 3000
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION_IN_MINUTES,
  mongoUri: process.env.NODE_ENV !== 'test' ? process.env.MONGO_URI : process.env.MONGO_TEST_URI,
  mailFromName: process.env.MAIL_FROM_NAME,
  mailFromAddress: process.env.MAIL_FROM_ADDRESS,
  mailSMTPHost: process.env.MAIL_SMTP_HOST,
  mailSMTPPort: process.env.MAIL_SMTP_PORT,
  mailSMTPUser: process.env.MAIL_SMTP_USER,
  mailSMTPPassword: process.env.MAIL_SMTP_PASSWORD,
  frontendUrl: process.env.FRONTEND_URL,
  cpKey: process.env.CP_KEY,
  cpSecret: process.env.CP_SECRET,
  corsOptions,
  bodyParseJson,
  bodyParseUrlencoded,
  il8nConfigure,
  sockets
}
