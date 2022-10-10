const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");
//create userDao

router.get("/", async function(req, res) {

    /**
     * Create auth-middleware file which will verify if user has logged in
     */

    res.render("home");
});

module.exports = router;