const Article = require('../models/article');
const ForbiddenError = require('../middlewares/errors/forbiddenError');
const NotFoundError = require('../middlewares/errors/notFoundError');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.send(articles))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner').orFail(new NotFoundError('Несуществующий Id статьи или статья отсутствует'))
    .then((article) => {
      if (req.user._id.toString() === article.owner.toString()) {
        res.send(article);
        article.remove();
      }
      throw new ForbiddenError('Недостаточно прав пользователя для удаления');
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
