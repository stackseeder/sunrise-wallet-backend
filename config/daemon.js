const currenciesDaemon = require('../app/daemon/currencies.daemon');

module.exports = () => {
  // currencies daemon
  currenciesDaemon(['0 * * * * *']);
};
