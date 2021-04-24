const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: 50
    },
    lastName: {
      type: String,
      maxlength: 50
    },
    middleName: {
      type: String,
      maxlength: 50
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: false,
      select: false
    },
    image: {
      type: String
    },
    role: {
      type: String,
      required: true
    },
    verification: {
      type: String,
      maxlength: 50
    },
    verificationExpires: {
      type: Date,
      default: Date.now,
      select: false
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
// todo: add profession into users
const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, null, (error, newHash) => {
    if (error) {
      return next(error)
    }
    user.password = newHash
    return next()
  })
}

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    return hash(user, salt, next)
  })
}

UserSchema.pre('save', function(next) {
  const that = this
  const SALT_FACTOR = 5
  if (!that.isModified('password')) {
    return next()
  }
  return genSalt(that, SALT_FACTOR, next)
})

UserSchema.methods.comparePassword = function(passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  )
}

UserSchema.plugin(mongoosePaginate)
UserSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('User', UserSchema)
