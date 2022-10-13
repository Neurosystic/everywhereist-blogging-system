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
    const articleId = req.query.articleId;
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

router.post("/editArticle", upload.single("imageFile"), async function (req, res) {
    const id = req.body.articleId;
    const oldArticle = await articleDao.retrieveArticleById(id);

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

    const updatedArticle = {
        id : oldArticle.id,
        title : req.body.title,
        content : req.body.content,
        image : imageFile,
        date_published : oldArticle.date_published,
        date_edited : getCurrentTime(),
        author_id: res.locals.user.id
    }

    await articleDao.updateArticle(updatedArticle);
    res.locals.article = updatedArticle;
    res.redirect(`/article/${updatedArticle.id}`);
});

router.post("/deleteArticle", async function(req, res){
    const articleId = req.body.articleId;
    await articleDao.deleteArticle(articleId);
    res.setToastMessage("Successfully deleted article!");
    res.redirect("/");
});

module.exports = router;