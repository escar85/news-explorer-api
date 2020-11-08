const jwt = require('jsonwebtoken');

const JWT_SECRET = require('../config');
const WrongCredentialsError = require('./errors/wrongCredentialsError');

const auth = (req, res, next) => {
  try {
    // заголовок авторизации
    const { authorization } = req.headers;
    // если загаловка нет или он не начинается с "Bearer" - вернем ошибку авторизации
    if (!authorization && !authorization.startsWith('Bearer ')) {
      throw new WrongCredentialsError('Необходима авторизация');
    }

    // извлекаем токен
    const token = authorization.replace('Bearer ', '');
    let payload;

    // верифицируем токен с помощью метода "verify" и обрабатываем ошибку
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new WrongCredentialsError('Необходима авторизация');
    }
    req.user = payload;
  } catch (err) { throw new WrongCredentialsError('Необходима авторизация'); }

  next();
};

module.exports = auth;
