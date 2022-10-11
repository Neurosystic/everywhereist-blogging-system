const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");

router.get("/api/users", async function(req, res){
    const userArray = await userDao.retrieveAllUsers();
    res.json(userArray);
});

router.get("/api/articles", async function(req, res){
    
});

module.exports = router;