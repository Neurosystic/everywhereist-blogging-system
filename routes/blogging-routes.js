
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
        res.setToastMessage("User does not exist!");
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

router.get("/article/:id", async function(req,res){
    const articleId = req.params.id;
    const article = await articleDao.retrieveArticleById(articleId);

    if(!article){
        res.setToastMessage("Article does not exist!");
        return res.redirect("/");
    }
    res.locals.article = article;
    res.render("articleView");
});

//please implement the below routers, thank you - sophie!
router.get("/createArticle", verifyAuthenticated, async function(req, res){

    res.render("editor");
});

router.post("/createArticle", async function(req, res){

});

router.get("/article/:id/editArticle", async function(req, res){
    // need a way to authentiicate this so that only req.locals.user == article.author_id can edit, else redirect appropriately


    res.render("editor");
});

router.post("/editArticle", async function(req, res){

    let newContent = res.body.content;

    let articleDetails = retrieveArticleById(req.body.articleID);

    let editedArticle = {
        "title" : articleDetails.title,
        "content" : newContent,
        "image" : req.body.image,
        "date_published" : articleDetails.date_published,
        "date_edited" : req.body.date,
        "author_id" : articleDetails.author_id,
    };

    updateArticle(editedArticle);

});

module.exports = router;