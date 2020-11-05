const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');

articlesRouter.get('/articles', getArticles);

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom((value, helpers) => {
      if (!isURL(value)) return helpers.message('Невалидная ссылка. Проверьте путь к изображению');
      return value;
    }),
    image: Joi.string().custom((value, helpers) => {
      if (!isURL(value)) return helpers.message('Невалидная ссылка. Проверьте путь к изображению');
      return value;
    }),
  }),
}), createArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteArticle);

module.exports = articlesRouter;
