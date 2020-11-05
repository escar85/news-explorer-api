const router = require('express').Router();
const usersRouter = require('./users');
const articlesRouter = require('./articles');

router.use('/', usersRouter);
router.use('/', articlesRouter);

module.exports = router;
