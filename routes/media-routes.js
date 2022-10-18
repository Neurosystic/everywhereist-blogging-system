const express = require("express");
const router = express.Router();

const articleDao = require("../modules/articles-dao.js");
const likeArticleDao = require("../modules/liked-articles-dao.js");
const commentDao = require("../modules/comments-dao.js");
const subscriptionDao = require("../modules/subscription-dao.js");
const notificationDao = require("../modules/notification-dao.js");

const { getCurrentTime } = require("../modules/format-functions.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
router.use(verifyAuthenticated);

router.get("/likeArticle/:articleId", async function(req, res){
    const articleId = req.params.articleId;
    const userId = res.locals.user.id;
    await likeArticleDao.registerArticleLiked(articleId, userId, getCurrentTime());
    res.redirect("back");
});

router.get("/unlikeArticle/:articleId", async function(req, res){
    const articleId = req.params.articleId;
    const userId = res.locals.user.id;
    await likeArticleDao.removeArticleLiked(articleId, userId);
    res.redirect("back");
});

router.post("/postComment", async function(req, res){
    let parent_comment_id = req.body.commentId;
    let description = "replied to";
    if(!parent_comment_id){
        parent_comment_id = null;
        description ="made";
    }
    const comment = {
        content : req.body.comment,
        date_published : getCurrentTime(),
        parent_comment_id : parent_comment_id,
        article_id : req.body.articleId,
        commenter_id : res.locals.user.id
    }
    await commentDao.createComment(comment);

    const article = await articleDao.retrieveArticleById(req.body.articleId);

    const notificationObj = {
        evoker_id : res.locals.user.id,
        type : "comment",
        description : `${description} a comment on: "${article.title}"`,
        date_published : article.date_published,
        comment_id : comment.id,
        article_id : article.id,
        subscribed_to : null
    }

    await notificationDao.registerNotification(notificationObj);
    res.redirect("back");
});

router.get("/deleteComment/:commentId", async function(req, res){
    const commentId = req.params.commentId;
    await commentDao.deleteComment(commentId);
    res.redirect("back");
});

router.get("/subscribe/:authorId", async function(req, res){
    const authorId = req.params.authorId;
    const subscriberId = res.locals.user.id;
    const date_published = getCurrentTime();
    await subscriptionDao.registerSubscription(subscriberId, authorId, date_published);

    const notificationObj = {
        evoker_id : res.locals.user.id,
        type : "follow",
        description : "started following you",
        date_published : date_published,
        comment_id : null,
        article_id : null,
        subscribed_to : authorId
    }

    await notificationDao.registerNotification(notificationObj);
    res.redirect("back");
});

router.get("/unsubscribe/:authorId", async function(req, res){
    const authorId = req.params.authorId;
    const subscriberId = res.locals.user.id;
    await subscriptionDao.removeSubscription(subscriberId, authorId);
    res.redirect("back");
});

router.get("/removeFollower/:followerId", async function(req, res){
    const followerId = req.params.followerId;
    const authorId = res.locals.user.id;
    await subscriptionDao.removeSubscription(followerId, authorId);
    res.redirect("back");
});

router.post("/readNotification/:notificationId/:evokerId/:receiverId", async function(req, res){
    const obj = {
        notification_id : req.params.notificationId,
        receiver_id : req.params.receiverId,
        evoker_id : req.params.evokerId
    }
    await notificationDao.updateNotificationReadStatus(obj);

    res.redirect(req.body.redirect);
});



module.exports = router;