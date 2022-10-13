const express = require("express");
const fs = require("fs");
const jimp = require("jimp");
const router = express.Router();

const articleDao = require("../modules/articles-dao.js");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const { getCurrentTime } = require("../modules/current-time.js");
const upload = require("../middleware/multer-uploader.js");

router.get("/article/:id", async function (req, res) {
    const articleId = req.params.id;
    const article = await articleDao.retrieveArticleById(articleId);

    if (!article) {
        res.setToastMessage("Article does not exist!");
        return res.redirect("/");
    }
    res.locals.article = article;
    res.render("articleView");
});

router.get("/createArticle", verifyAuthenticated, async function (req, res) {
    res.render("editor");
});

router.post("/createArticle", upload.single("imageFile"), async function (req, res) {
    const fileInfo = req.file;
    let imageFile = null;
    if (fileInfo) {
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);
        const image = await jimp.read(newFileName);
        image.resize(320, jimp.AUTO);
        await image.write(`./public/images/thumbnails/${fileInfo.originalname}`);
        imageFile = fileInfo.originalname;
    } 

    const article = {
        title: req.body.title,
        content: req.body.content,
        image: imageFile,
        date_published: getCurrentTime(),
        author_id: res.locals.user.id
    }
    await articleDao.createArticle(article);
    console.log(article)
    res.redirect(`/article/${article.id}`);
});

router.get("/editArticle", verifyAuthenticated, async function (req, res) {
    // need a way to authentiicate this so that only req.locals.user == article.author_id can edit, else redirect appropriately
    const articleId = req.query.id;
    const article = await articleDao.retrieveArticleById(articleId);

    if (!article) {
        res.setToastMessage("Article does not exist!");
        return res.redirect("/");
    }
    if(article.author_id != res.locals.user.id){
        res.setToastMessage("You do not have rights to edit the article");
        return res.redirect(`/article/${articleId}`)
    }
    res.locals.article = article;
    res.render("editor");
});

///editttt

router.post("/editArticle", async function (req, res) {

    let newContent = res.body.content;

    let articleDetails = retrieveArticleById(req.body.articleID);

    let editedArticle = {
        "title": articleDetails.title,
        "content": newContent,
        "image": req.body.image,
        "date_published": articleDetails.date_published,
        "date_edited": req.body.date,
        "author_id": articleDetails.author_id,
    };

    updateArticle(editedArticle);
});

router.post("/deleteArticle", async function(req, res){
    
});

module.exports = router;