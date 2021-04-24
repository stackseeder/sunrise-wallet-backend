const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const CurrencySchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true
    },
    is_fiat: {
      type: Number
    },
    rate_usd: {
      type: String,
      required: true
    },
    last_update: {
      type: String,
      required: true
    },
    tx_fee: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    confirms: {
      type: String,
      required: true
    },
    accepted: {
      type: Number,
      required: true,
      default: 0,
    },
    image_url: {
      type: String,
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

CurrencySchema.plugin(mongoosePaginate)
CurrencySchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Currency', CurrencySchema)
