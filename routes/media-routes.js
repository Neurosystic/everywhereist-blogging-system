const express = require("express");
const router = express.Router();

const likeArticleDao = require("../modules/liked-articles-dao.js");
const commentDao = require("../modules/comments-dao.js");
const subscriptionDao = require("../modules/subscription-dao.js");

const { getCurrentTime } = require("../modules/format-functions.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
router.use(verifyAuthenticated);

router.post("/likeArticle", async function(req, res){
    const articleId = req.body.articleId;
    const userId = res.locals.user.id;
    await likeArticleDao.registerArticleLiked(articleId, userId);
    res.redirect("back");
});

router.post("/unlikeArticle", async function(req, res){
    const articleId = req.body.articleId;
    const userId = res.locals.user.id;
    await likeArticleDao.removeArticleLiked(articleId, userId);
    res.redirect("back");
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
    res.redirect("back");
});

router.post("/deleteComment", async function(req, res){
    const commentId = req.body.commentId;
    await commentDao.deleteComment(commentId);
    res.redirect("back");
});

router.post("/subscribe", async function(req, res){
    const authorId = req.body.authorId;
    const subscriberId = res.locals.user.id;
    await subscriptionDao.registerSubscription(subscriberId, authorId, getCurrentTime());
    res.redirect("back");
});

router.post("/unsubscribe", async function(req, res){
    const authorId = req.body.authorId;
    const subscriberId = res.locals.user.id;
    await subscriptionDao.removeSubscription(subscriberId, authorId);
    res.redirect("back");
});

router.post("/removeFollower", async function(req, res){
    const followerId = req.body.followerId;
    const authorId = res.locals.user.id;
    await subscriptionDao.removeSubscription(followerId, authorId);
    res.redirect("back");
});

module.exports = router;