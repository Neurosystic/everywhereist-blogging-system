const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");
const articleDao = require("../modules/articles-dao.js");

router.get("/api/users", async function(req, res){
    const userArray = await userDao.retrieveAllUsers();
    res.json(userArray);
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

module.exports = router;