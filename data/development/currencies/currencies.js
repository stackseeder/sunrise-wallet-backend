const faker = require('faker')
const ObjectID = require('mongodb').ObjectID

module.exports = [
  {
    '_id': { '$oid': '60841c33e2e7461b3070b925' },
    'accepted': 1,
    'symbol': 'BTC',
    'is_fiat': 0,
    'last_update': '1375473661',
    'tx_fee': '0.00100000',
    'status': 'online',
    'name': 'Bitcoin',
    'confirms': '2',
    'rate_usd': '49496.09002079414',
    'createdAt': { '$date': '2021-04-24T13:25:07.878Z' },
    'updatedAt': { '$date': '2021-04-24T13:41:06.830Z' }
  },
  {
    '_id': { '$oid': '60841c33e2e7461b3070bc0f' },
    'accepted': 1,
    'symbol': 'ETH',
    'is_fiat': 0,
    'last_update': '1619269861',
    'tx_fee': '0.00400000',
    'status': 'online',
    'name': 'Ether',
    'confirms': '3',
    'rate_usd': '2219.475813347059',
    'createdAt': { '$date': '2021-04-24T13:25:07.922Z' },
    'updatedAt': { '$date': '2021-04-24T13:41:06.836Z' }
  },
  {
    '_id': { '$oid': '60841c33e2e7461b3070c082' },
    'accepted': 1,
    'symbol': 'TRX',
    'is_fiat': 0,
    'last_update': '1619269861',
    'tx_fee': '0.20000000',
    'status': 'online',
    'name': 'TRON',
    'confirms': '10',
    'rate_usd': '0.10778056252075754',
    'createdAt': { '$date': '2021-04-24T13:25:07.959Z' },
    'updatedAt': { '$date': '2021-04-24T13:41:06.838Z' }
  },
  {
    '_id': { '$oid': '60841c33e2e7461b3070c10a' },
    'accepted': 1,
    'symbol': 'VTC',
    'is_fiat': 0,
    'last_update': '1619269861',
    'tx_fee': '0.00300000',
    'status': 'online',
    'name': 'Vertcoin',
    'confirms': '3',
    'rate_usd': '1.5920701309451806',
    'createdAt': { '$date': '2021-04-24T13:25:07.963Z' },
    'updatedAt': { '$date': '2021-04-24T13:41:06.840Z' }
  },
  {
    '_id': { '$oid': '60841c33e2e7461b3070c168' },
    'accepted': 1,
    'symbol': 'XMR',
    'is_fiat': 0,
    'last_update': '1619269861',
    'tx_fee': '0.01000000',
    'status': 'online',
    'name': 'Monero',
    'confirms': '3',
    'rate_usd': '367.8659557592909',
    'createdAt': { '$date': '2021-04-24T13:25:07.966Z' },
    'updatedAt': { '$date': '2021-04-24T13:41:06.841Z' }
  },
  {
    '_id': { '$oid': '60841c33e2e7461b3070c1b6' },
    'accepted': 1,
    'symbol': 'LTCT',
    'is_fiat': 0,
    'last_update': '1619269861',
    'tx_fee': '0.00100000',
    'status': 'online',
    'name': 'Litecoin Testnet',
    'confirms': '0',
    'rate_usd': '226.78273101648836',
    'createdAt': { '$date': '2021-04-24T13:25:07.968Z' },
    'updatedAt': { '$date': '2021-04-24T13:41:06.843Z' }
  }
]
