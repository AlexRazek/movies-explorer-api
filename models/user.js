const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
// const validator = require('validator'); // импортируем validator
const isEmail = require('validator/lib/isEmail');
const Unauthorized = require('../utils/errors/unauthorized');
const messages = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (isValid) => isEmail(isValid),
      // validator(v) {
      //   return /^\S+@\S+\.\S+$/.test(v);
      // },
      message: messages.invalidEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized(messages.invalidEmailOrPassword));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized(messages.invalidEmailOrPassword));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
