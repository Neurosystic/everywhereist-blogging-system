const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer-uploader.js");

const articleDao = require("../modules/articles-dao.js");
const commentDao = require("../modules/comments-dao.js");
const likeArticleDao = require("../modules/liked-articles-dao.js");
const notificationDao = require("../modules/notification-dao.js");

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { getCurrentTime } = require("../modules/format-functions.js");
const { convertCommentsToTree } = require("../modules/format-functions.js");
const { formatImage } = require("../modules/format-functions.js");

router.get("/article/:id", async function (req, res) {
  const articleId = req.params.id;
  const article = await articleDao.retrieveArticleById(articleId);
  if (!article) {
    res.setToastMessage("Article does not exist!");
    return res.redirect("/");
  }
  res.locals.article = article;
  const comments = await commentDao.retrieveCommentByArticleId(articleId);
  const commentTree = convertCommentsToTree(comments);
  const likeArray = await likeArticleDao.retrieveArticleLikes(articleId);
  res.locals.likeCount = likeArray.length;
  res.locals.commentTree = commentTree;
  res.locals.title = article.title;
  res.render("articleView");
});

router.get("/createArticle", verifyAuthenticated, async function (req, res) {
  res.locals.title = "Create a new article";
  res.render("editor");
});

router.post(
  "/createArticle",
  upload.single("imageFile"),
  async function (req, res) {
    const fileInfo = req.file;
    const imageFile = await formatImage(fileInfo);

    const article = {
      title: req.body.title,
      content: req.body.content,
      image: imageFile,
      date_published: getCurrentTime(),
      author_id: res.locals.user.id
    }
    await articleDao.createArticle(article);

    const notificationObj = {
      evoker_id: res.locals.user.id,
      type: "article",
      description: `published an article: "${article.title}"`,
      date_published: article.date_published,
      comment_id: null,
      article_id: article.id,
      subscribed_to: null
    }

    await notificationDao.registerNotification(notificationObj);

    res.redirect(`/article/${article.id}`);
  }
);

router.get(
  "/editArticle/:articleId",
  verifyAuthenticated,
  async function (req, res) {
    const articleId = req.params.articleId;
    const article = await articleDao.retrieveArticleById(articleId);

    if (!article) {
      res.setToastMessage("Article does not exist!");
      return res.redirect("/");
    }
    if (article.author_id != res.locals.user.id) {
      res.setToastMessage("You do not have rights to edit the article");
      return res.redirect("`/article/${articleId}`");
    }

    res.locals.article = article;
    res.locals.title = `Edit article: ${article.title}`;
    res.render("editor");
  }
);

router.post(
  "/editArticle",
  upload.single("imageFile"),
  async function (req, res) {
    const id = req.body.articleId;
    const oldArticle = await articleDao.retrieveArticleById(id);

    const fileInfo = req.file;
    const imageFile = await formatImage(fileInfo);

    const updatedArticle = {
      id: oldArticle.id,
      title: req.body.title,
      content: req.body.content,
      image: imageFile,
      date_published: oldArticle.date_published,
      date_edited: getCurrentTime(),
      author_id: res.locals.user.id
    }

    await articleDao.updateArticle(updatedArticle);
    res.locals.article = updatedArticle;

    const notificationObj = {
      evoker_id: res.locals.user.id,
      type: "article",
      description: `edited an article: "${updatedArticle.title}"`,
      date_published: updatedArticle.date_published,
      comment_id: null,
      article_id: updatedArticle.id,
      subscribed_to: null
    }

    await notificationDao.registerNotification(notificationObj);
    res.redirect(`/article/${updatedArticle.id}`);
  }
);

router.get("/deleteArticle/:articleId", async function (req, res) {
  const articleId = req.params.articleId;
  const article = await articleDao.retrieveArticleById(articleId);
  if (res.locals.user.id != article.author_id) {
    res.setToastMessage("You do not have rights to edit the article");
    return res.redirect("/");
  } else {
    await articleDao.deleteArticle(articleId);
    res.setToastMessage("Successfully deleted article!");
    res.redirect("/");
  }
});

module.exports = router;
