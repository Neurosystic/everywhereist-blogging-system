const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const hashSalt = require("../modules/hash-salt.js");
const userDao = require("../modules/users-dao.js");

router.get("/login", function(req, res){

    res.render("login");
});

router.post("/login", async function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const user = await userDao.retrieveUserByUsername(username);

    if(!user){
        res.locals.user = null;
        res.setToastMessage("Username does not exist");
        return res.redirect("./login");
    }
    const passwordIsMatch = await hashSalt.passwordIsMatch(password, user.hash_password);

    if(passwordIsMatch){
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;
        res.redirect("/");
    } else {
        res.locals.user = null;
        res.setToastMessage("Invalid password");
        res.redirect("./login");
    }
});

router.get("/signUp", function(req, res){
    res.render("detailsForm");
});

router.post("/signUp", async function(req, res){
    const hash_password = await hashSalt.generateHash(req.body.password);
    const authToken = uuid();
    res.cookie("authToken", authToken);

    const user = {
        fname : req.body.fname,
        lname : req.body.lname,
        username : req.body.username,
        hash_password : hash_password,
        birth_date : req.body.birthDate,
        email : req.body.email,
        description : req.body.description,
        avatar : req.body.avatar,
        authToken : authToken
    }
    await userDao.createUser(user);
    res.locals.user = user;

    res.redirect("/profile");
});

router.get("/logout", function(req, res){
    res.clearCookie("authToken");
    res.locals.user = null;
    //do we want to have toastMessages to deliever some transient messages???
    res.setToastMessage("Successfully logged out!");
    res.redirect("/");
});

module.exports = router;