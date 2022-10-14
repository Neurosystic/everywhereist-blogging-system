const express = require("express");
const router = express.Router();

const likeArticleDao = require("../modules/liked-articles-dao.js");
const commentDao = require("../modules/comments-dao.js");
const { getCurrentTime } = require("../modules/format-functions.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
router.use(verifyAuthenticated);

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

router.post("/postComment", async function(req, res){
    let parent_comment_id = req.body.commentId;
    if(!parent_comment_id){
        parent_comment_id = null;
    }
    const comment = {
        content : req.body.comment,
        date_published : getCurrentTime(),
        parent_comment_id : parent_comment_id,
        article_id : req.body.articleId,
        commenter_id : res.locals.user.id
    }
    await commentDao.createComment(comment);
    res.redirect(`/article/${req.body.articleId}`);
});

router.post("/deleteComment", async function(req, res){
    const commentId = req.body.commentId;
    await commentDao.deleteComment(commentId);
    res.redirect(`/article/${req.body.articleId}`);
});

module.exports = router;