const CronJob = require('cron').CronJob
const cpService = require('../services/coinpayment')
const currenciesHelper = require('../helpers/currencies.helper')

const convertBtcRateToUsdRate = (btcRate) => {
  if (Number(btcRate) > 0) {
    return 1 / Number(btcRate);
  }
  return 0;
};

const job = schedule =>
  new CronJob(schedule, async () => {
    try {
      console.log(
        `[${new Date().toLocaleString()}] => Currencies - Patching`
      )
      const coinsMap = await cpService.getSupportedCoins();
      const currencies = await currenciesHelper.getAllCurrencies();

      if (coinsMap) {
        const nCurrencies = []; // to register currencies
        const uCurrencies = []; // to update currencies
        const dCurrencies = []; // to delete currencies
        let usdRate = 0;
        if (!coinsMap['USD']) {
          return;
        }
        usdRate = convertBtcRateToUsdRate(coinsMap['USD'].rate_btc);

        Object.keys(coinsMap).forEach(symbol => {
          const coin = {
            symbol,
            ...coinsMap[symbol],
            rate_usd: coinsMap[symbol].rate_btc * usdRate,
            image_url: `/uploads/currencies/${symbol}.png`,
          };
          if (Number(coin.accepted) === 1) {
            const index = currencies.findIndex(currency => currency.symbol === symbol);
            if (index >= 0) {
              uCurrencies.push(coin);
            } else {
              nCurrencies.push(coin);
            }
          }
        });
        currencies.forEach(currency => {
          const index = Object.keys(coinsMap).indexOf(currency.symbol);
          if (index === -1 || (index >=0 && Number(coinsMap[currency.symbol].accepted) !== 1)) {
            dCurrencies.push(currency.symbol);
          }
        });

        if (nCurrencies.length) {
          await currenciesHelper.registerCurrencies(nCurrencies);
          console.log(
            `[${new Date().toLocaleString()}] => Currencies - Registered`
          )
        }
        if (uCurrencies.length) {
          for(let i = 0; i < uCurrencies.length; i++) {
            await currenciesHelper.updateCurrency({ symbol: uCurrencies[i].symbol }, uCurrencies[i]);
          }
          console.log(
            `[${new Date().toLocaleString()}] => Currencies - Updated`
          )
        }
        if (dCurrencies.length) {
          await currenciesHelper.removeCurrencies({
            symbol: { $in: dCurrencies }
          });
          console.log(
            `[${new Date().toLocaleString()}] => Currencies - Deleted`
          )
        }
      }

      console.log(
        `[${new Date().toLocaleString()}] => Currencies - Success`
      )
    } catch (e) {
      console.log(
        `[${new Date().toLocaleString()}] => Currencies - Failed`
      )
    }
  })

const startCurrenciesDaemon = schedules => {
  schedules.forEach(schedule => job(schedule).start())
}

module.exports = startCurrenciesDaemon
