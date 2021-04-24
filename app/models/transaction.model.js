const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const TransactionSchema = new mongoose.Schema(
  {
    txn_id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    address: {
      type: String,
      required: true
    },
    dest_tag: {
      type: String
    },
    status: {
      type: Number,
      min: 0,
      required: true
    },
    status_text: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    confirms: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    amounti: {
      type: Number,
      required: true
    },
    fee: {
      type: Number,
      min: 0
    },
    feei: {
      type: Number,
      min: 0
    },
    fiat_coin: {
      type: Number,
      min: 0,
      required: true
    },
    fiat_amount: {
      type: Number,
      min: 0,
      required: true
    },
    fiat_amounti: {
      type: Number,
      min: 0,
      required: true
    },
    fiat_fee: {
      type: Number,
      min: 0
    },
    fiat_feei: {
      type: Number,
      min: 0
    },
    label: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

TransactionSchema.plugin(mongoosePaginate)
TransactionSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Transaction', TransactionSchema)
