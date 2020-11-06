const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = require('../config');
const MongoError = require('../middlewares/errors/mongoError');
const NotFoundError = require('../middlewares/errors/notFoundError');

// возвращает данные пользователя при запросе get на роут users/me
const getUserById = (req, res, next) => {
  User.findById(req.user).orFail(new NotFoundError('Пользователь с таким id отсутствует'))
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  // bcrypt.hash хэшируем пароль, добавляем соль "10"
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      name: req.body.name,
      password: hash,
    }))
    .then((user) => {
      const newUser = user;
      newUser.password = '';
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new MongoError('Пользователь с таким E-Mail уже зарегистрирован');
      }
      throw new Error(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserById,
  createUser,
  login,
};
