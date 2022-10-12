
const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");
const articleDao = require ("../modules/articles-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/profile", verifyAuthenticated, function(req, res){
    //get by authentication token stored in cookie 
    //verify if authenticated, otherwise redirect elsewhere
    res.locals.viewingUser = res.locals.user;
    res.render("userAdmin");
});

router.get("/user/:id", async function(req, res){
    const viewingId = req.params.id;
    const viewingUser = await userDao.retrieveUserById(viewingId);

    if(!viewingUser){
        return res.redirect("/"); //Change this in the future
    }
    res.locals.viewingUser = viewingUser;
    if(!res.locals.user){
        return res.render("userProfile");
    }
    if(res.locals.user.id == viewingUser.id){
        return res.redirect("/profile");
    }
    
    res.render("userProfile");
});

router.get("/articles/:id", async function(req,res){
    const articleId = req.params.id;
    const articles = await articleDao.retrieveArticleById(articleId);

    if(!articles){
        return res.redirect("/");
    }
    res.locals.articles = articles;
    res.render("articleView");
});


module.exports = router;