const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Email должен быть валидным')
      .messages({
        'string.empty': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная допустимая длина пароля - 8 символов',
        'string.empty': 'Поле "password" должно быть заполнено',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная допустимая длина имени - 2 символа',
        'string.max': 'Максимальная допустимая длина имена - 30 символов',
        'string.empty': 'Поле "name" должно быть заполнено',
      }),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Email должен быть валидным')
      .messages({
        'string.empty': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная допустимая длина пароля - 8 символов',
        'string.empty': 'Поле "password" должно быть заполнено',
      }),
  }),
});

const validateArticleDelete = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24)
      .messages({
        'any.required': 'Невалидный Id статьи',
      }),
  }),
});

const validateArticleCreate = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required()
      .messages({
        'string.empty': 'Поле "keyword" должно быть заполнено',
      }),
    title: Joi.string().required()
      .messages({
        'string.empty': 'Поле "title" должно быть заполнено',
      }),
    text: Joi.string().required()
      .messages({
        'string.empty': 'Поле "text" должно быть заполнено',
      }),
    date: Joi.string().required()
      .messages({
        'string.empty': 'Поле "date" должно быть заполнено',
      }),
    source: Joi.string().required()
      .messages({
        'string.empty': 'Поле "source" должно быть заполнено',
      }),
    link: Joi.string().custom((value, helpers) => {
      if (!isURL(value)) return helpers.message('Невалидная ссылка. Проверьте путь к изображению');
      return value;
    }),
    image: Joi.string().custom((value, helpers) => {
      if (!isURL(value)) return helpers.message('Невалидная ссылка. Проверьте путь к изображению');
      return value;
    }),
  }),
});

module.exports = {
  validateUser,
  validateAuth,
  validateArticleDelete,
  validateArticleCreate,
};
