const express = require("express");
const router = express.Router();

const likeArticleDao = require("../modules/liked-articles-dao.js");

router.post("/likeArticle", async function(req, res){
    const articleId = req.body.articleId;
    const userId = res.locals.user.id;
    await likeArticleDao.registerArticleLiked(articleId, userId);
    res.redirect(`/article/${articleId}`);
});

router.post("/unlikeArticle", async function(req, res){
    const articleId = req.body.articleId;
    const userId = res.locals.user.id;
    await likeArticleDao.removeArticleLiked(articleId, userId);
    res.redirect(`/article/${articleId}`);
});

module.exports = router;