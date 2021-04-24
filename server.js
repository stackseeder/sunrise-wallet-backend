// make bluebird default Promise
Promise = require('bluebird') // eslint-disable-line no-global-assign
const http = require('http')

const app = require('./config/express')
const daemon = require('./config/daemon')
const initializeSocket = require('./config/socket')

const { consoleLogWrapper } = require('./app/services/utils')
const { port, env } = require('./config/vars')

const server = http.createServer(app)

// initialize socket handlers
initializeSocket(server)

// listen to requests
server.listen(port, () =>
  consoleLogWrapper(true, `App started on port ${port} (${env})`)
)

// start daemon
daemon();

/**
 * Exports express
 * @public
 */
module.exports = server
