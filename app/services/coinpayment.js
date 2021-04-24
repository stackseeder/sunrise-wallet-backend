const CoinPayments = require('coinpayments');
const { cpKey, cpSecret } = require('../../config/vars');

const client = new CoinPayments({
  key: cpKey,
  secret: cpSecret,
  autoIpn: true
});

exports.getDepositAddress = async (currency) => {
  return await client.getCallbackAddress({ currency });
};

exports.getSupportedCoins = async () => {
  return await client.rates({
    accepted: 1,
  });
};
