const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const sentry = require('@sentry/node')
const useragent = require('express-useragent')

const initMongo = require('./mongo')

const {
  env,
  corsOptions,
  bodyParseJson,
  bodyParseUrlencoded,
  il8nConfigure,
  sentryDSN
} = require('./vars')

i18n.configure(il8nConfigure)

if (env === 'production' && sentryDSN) {
  sentry.init({ dsn: sentryDSN })
}

app.use(i18n.init)

app.use(bodyParser.json(bodyParseJson))

app.use(bodyParser.urlencoded(bodyParseUrlencoded))

app.use(cors(corsOptions))

app.use(passport.initialize())

app.use(compression())

app.use(helmet())

app.use(useragent.express())

// Enable only in development HTTP request logger
if (env === 'development') {
  app.use(morgan('dev'))
}

app.use('/api', require('../app/routes'))

// static resources route
app.use('/uploads', express.static(path.resolve('./uploads')))

// Init MongoDB
initMongo()

module.exports = app // for testing
