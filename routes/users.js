const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserById,
} = require('../controllers/users');

usersRouter.get('/users/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

module.exports = usersRouter;
