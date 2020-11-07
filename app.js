require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');

const router = require('./routes');
const mainErrorHandler = require('./middlewares/errors/mainErrorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateUser, validateAuth } = require('./middlewares/validation');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
router.post('/signin', validateAuth, login);
router.post('/signup', validateUser, createUser);
app.use(router);
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// централизованная обработка ошибок. принимает на вход аргумент-ошибку со статусом и сообщением
app.use(mainErrorHandler);
app.listen(PORT);
