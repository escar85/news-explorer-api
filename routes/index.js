const router = require('express').Router();
const usersRouter = require('./users');
const articlesRouter = require('./articles');

const auth = require('../middlewares/auth');
// const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../middlewares/errors/notFoundError');
// const { validateUser, validateAuth } = require('../middlewares/validation');

// незащищеные маршруты
// router.post('/signin', validateAuth, login);
// router.post('/signup', validateUser, createUser);

router.use(auth); // миддлвэр авторизации защищает маршруты
router.use('/', usersRouter);
router.use('/', articlesRouter);
router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
