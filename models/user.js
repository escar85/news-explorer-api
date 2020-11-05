const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const WrongCredentialsError = require('../middlewares/errors/wrongCredentialsError');
const NotFoundError = require('../middlewares/errors/notFoundError');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },

  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

// находим пользователя по email и проверяем пароль
userSchema.statics.findUserByCredentials = function check(email, password) {
  return this.findOne({ email }).select('+password').orFail(new NotFoundError('Пользователь отсутствует. Необходимо зарегистрироваться'))
    .then((user) => {
      if (!user) {
        return Promise.reject(new WrongCredentialsError('Неверные почта или пароль'));
      }

      // bcrypt.compare сравнивает переданный пароль с хэшем пароля в базе
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new WrongCredentialsError('Неверные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
