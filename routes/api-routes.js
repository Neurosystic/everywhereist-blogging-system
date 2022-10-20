const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");

const hashSalt = require("../modules/hash-salt.js");
const userDao = require("../modules/users-dao.js");
const articleDao = require("../modules/articles-dao.js");
const likeArticleDao = require("../modules/liked-articles-dao.js");
const subscriptionDao = require("../modules/subscription-dao.js");
const commentDao = require("../modules/comments-dao.js");

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
    
    for(let i = 0; i < articleArray.length; i++){
        const likeArray =  await likeArticleDao.retrieveArticleLikes(articleArray[i].id);
        const commentArray = await commentDao.retrieveCommentByArticleId(articleArray[i].id);
        const popularity = commentArray.length + (2 * likeArray.length);
        articleArray[i].commentCount = commentArray.length;
        articleArray[i].likeCount = likeArray.lenght;
        articleArray[i].popularity = popularity;
        articleArray[i].likeCount = (popularity - (commentArray.length)) / 2;
    }

    res.json(articleArray);
});

router.get("/api/articleLikes", async function(req, res){
    const articleId = req.query.articleId;
    const likeArray = await likeArticleDao.retrieveArticleLikes(articleId);
    res.json(likeArray);
});

router.get("/api/following", async function(req, res){
    const userId = req.query.userId;
    const followingArray = await subscriptionDao.retrieveUserFollowingList(userId);
    res.json(followingArray);
});

router.get("/api/followers", async function(req, res){
    const userId = req.query.userId;
    const followingArray = await subscriptionDao.retrieveUserFollowerList(userId);
    res.json(followingArray);
});

router.get("/api/commentPerDayForUser", async function(req, res){
    const userId = req.query.userId;
    const data = await commentDao.retrieveCommentPerDayByAuthorId(userId);
    res.json(data);

});

//The below route handler functions are for API requirement section of the group project
router.post("/api/login", bodyParser.json(), async function(req, res){
    const json = req.body;

    const user = await userDao.retrieveUserByUsername(json.username);
    if(!user){
        return res.status(401).send("Unauthorized");
    }
    const passwordIsMatch = await hashSalt.passwordIsMatch(json.password, user.hash_password);

    if(passwordIsMatch){
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.status(204).send(authToken);
    } else {
        res.status(401).send("Unauthorized");
    }
});

router.get("/api/logout", function(req, res){
    authToken = null;
    res.status(204).send("Logged out");
});

router.get("/api/users", async function(req, res){
    const userId = req.query.userId;
    const user = await userDao.retrieveUserById(userId);
    if(user.is_admin == 1){
        const userArray = await userDao.retrieveAllUsers();
        for(let i = 0; i < userArray.length; i++){
            userArray[i].articles = await articleDao.retrieveArticlesByAuthorId(userArray[i].id);
        }
        console.log(userArray);
        res.json(userArray);
    } else {
        res.status(401).send("Not an admin");
    }
});

router.delete("/api/users/:id", function(req, res){
    
});

module.exports = router;