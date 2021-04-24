const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const { emailStates } = require('../../config/constants')

const EmailHistoryScheme = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    subject: {
      type: String
    },
    status: {
      type: String,
      enum: emailStates,
      default: emailStates[0]
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

EmailHistoryScheme.plugin(mongoosePaginate)
EmailHistoryScheme.plugin(aggregatePaginate)

module.exports = mongoose.model('EmailHistory', EmailHistoryScheme)
