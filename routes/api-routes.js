const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");
const articleDao = require("../modules/articles-dao.js");
const likeArticleDao = require("../modules/liked-articles-dao.js");

router.get("/api/usernames", async function(req, res){
    const userArray = await userDao.retrieveAllUsers();

    let usernameArray = [];
    userArray.forEach(function (user) {
        usernameArray.push(user.username);
    });

    res.json(usernameArray);
});

router.get("/api/articles", async function(req, res){
    const sort = req.query.sort;
    const order = req.query.order;
    const userId = req.query.author;
    let articleArray = undefined;

    if(!order && !sort && !userId){
        articleArray = await articleDao.retrieveAllArticles();
    } else if (!order && !sort && userId){
        articleArray = await articleDao.retrieveArticlesByAuthorId(userId);
    } else if(sort && order && !userId){
        articleArray = await articleDao.retrieveArticlesBySort(sort, order);  
    } else {
        articleArray = await articleDao.retrieveArticlesByAuthorSort(userId, sort, order);
    }   

    res.json(articleArray);
});

router.get("/api/articleLikes", async function(req, res){
    const articleId = req.query.articleId;
    const likeArray = await likeArticleDao.retrieveArticleLikes(articleId);
    res.json(likeArray);
});

module.exports = router;