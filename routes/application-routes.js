const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
  res.locals.title = "Home Page";
  res.render("home");
});

module.exports = router;
