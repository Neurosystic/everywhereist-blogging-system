
const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");
const subscriptionDao = require("../modules/subscription-dao.js");
const likeArticleDao = require("../modules/liked-articles-dao.js");
const commentDao = require("../modules/comments-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/profile", verifyAuthenticated, async function(req, res){
    //get by authentication token stored in cookie 
    //verify if authenticated, otherwise redirect elsewhere
    const viewingId = res.locals.user.id;
    res.locals.viewingUser = res.locals.user;

    const followersArray = await subscriptionDao.retrieveUserFollowerList(viewingId);
    const likeArray = await likeArticleDao.retrieveUserTotalLikesReceived(viewingId);
    const commentArray = await commentDao.retrieveUserTotalCommentReceived(viewingId);
    
    res.locals.followerCount = followersArray.length;
    res.locals.likeCount = likeArray.length;
    res.locals.commentCount = commentArray.length;
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
    const followersArray = await subscriptionDao.retrieveUserFollowerList(viewingId);
    const likeArray = await likeArticleDao.retrieveUserTotalLikesReceived(viewingId);
    const commentArray = await commentDao.retrieveUserTotalCommentReceived(viewingId);
    
    res.locals.followerCount = followersArray.length;
    res.locals.likeCount = likeArray.length;
    res.locals.commentCount = commentArray.length;
    if(!res.locals.user){
        return res.render("userProfile");
    }
    if(res.locals.user.id == viewingUser.id){
        return res.redirect("/profile");
    }

    res.render("userProfile");
});

router.get("/editDetails", verifyAuthenticated, function(req, res){
    
    res.render("detailsForm");
});


router.post("/editDetails", async function(req, res){
    const user = {
        id : res.locals.user.id,
        fname : req.body.fname,
        lname : req.body.lname,
        username : req.body.username,
        hash_password : res.locals.user.hash_password,
        birth_date : req.body.birthDate,
        email : req.body.email,
        description : req.body.description,
        avatar : req.body.avatar,
        authToken : req.cookies.authToken
    }

    await userDao.updateUser(user);

    res.redirect("/profile");

});

router.post("/deleteAccount", async function(req, res){
    await userDao.deleteUser(res.locals.user.id);
    res.clearCookie("authToken");
    res.locals.user = null;
    //do we want to have toastMessages to deliever some transient messages???
    res.setToastMessage("Successfully deleted account!");
    res.redirect("/");
});

module.exports = router;