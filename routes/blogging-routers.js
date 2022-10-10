
const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/profile", verifyAuthenticated, function(req, res){
    //get by authentication token stored in cookie 
    //verify if authenticated, otherwise redirect elsewhere
    res.render("userAdmin");
});

router.get("/user/:id", async function(req, res){
    const id = req.params.id;
    const user = await userDao.retrieveUserById(id);

    if(!user){
        return res.redirect("/"); //Change this in the future
    }

    res.locals.user = user;
    res.render("userProfile");
});


module.exports = router;