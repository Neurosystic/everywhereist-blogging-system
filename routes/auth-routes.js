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
    const user = await userDao.retreiveUserByUsername(username);

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
    res.render("signUp");
});

router.post("/signUp", async function(req, res){
    const salt = await hashSalt.generateSalt();
    const hash_password = await hashSalt.generateHash(req.body.password, salt);
    const user = {
        fname : req.body.fname,
        lname : req.body.lname,
        username : req.body.username,
        hash_password : hash_password,
        salt : salt,
        birth_date : req.body.birthDate,
        email : req.body.email,
        description : req.body.description,
        avatar : req.body.avatar,
        authToken : null
    }

    await userDao.createUser(user);

    res.redirect("/");
});

module.exports = router;