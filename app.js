require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');

const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./middlewares/errors/notFoundError');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors());

app.listen(PORT);

app.use(express.json());

app.use(requestLogger);

// незащищеные маршруты
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(7),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(7),
  }),
}), createUser);

// миддлвэр авторизации защищает маршруты
app.use(auth);

app.use(router);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// централизованная обработка ошибок. принимает на вход аргумент-ошибку со статусом и сообщением
app.use((err, req, res, next) => {
  // если на вход не передана аргумент-ошибка, выставляем по умолчанию ошибку сервера
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});
