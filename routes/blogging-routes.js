
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

    let article = {
        "title" : res.body.title,
        "content" : res.body.content,
        "image" : res.body.image,
        "date_published" : res.body.date_published,
        "author_id" :res.body.author_id
   }
    
   createArticle(article);

});

router.get("/article/:id/editArticle", async function(req, res){
    // need a way to authentiicate this so that only req.locals.user == article.author_id can edit, else redirect appropriately


    res.render("editor");
});

router.post("/editArticle", async function(req, res){

});

module.exports = router;