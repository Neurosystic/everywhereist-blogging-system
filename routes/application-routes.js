const express = require("express");
const router = express.Router();

const articlesDao = require("../modules/articles-dao.js");


router.get("/", async function(req, res) {

    const articles = await articlesDao.retrieveAllArticles();
    res.locals.articles = articles;
    
    res.render("home");
});

module.exports = router;