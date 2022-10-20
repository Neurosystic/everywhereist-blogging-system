const express = require("express");
const router = express.Router();

const userDao = require("../modules/users-dao.js");
const articleDao = require("../modules/articles-dao.js");
const likeArticleDao = require("../modules/liked-articles-dao.js");
const subscriptionDao = require("../modules/subscription-dao.js");
const commentDao = require("../modules/comments-dao.js");
//
const hashSalt = require("../modules/hash-salt.js");
const { v4: uuid } = require("uuid");
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

router.get("/api/usernames", async function (req, res) {
  const userArray = await userDao.retrieveAllUsers();

  let usernameArray = [];
  userArray.forEach(function (user) {
    usernameArray.push(user.username);
  });

  res.json(usernameArray);
});

router.get("/api/articles", async function (req, res) {
  const sort = req.query.sort;
  const order = req.query.order;
  const userId = req.query.author;
  let articleArray = undefined;

  if (!order && !sort && !userId) {
    articleArray = await articleDao.retrieveAllArticles();
  } else if (!order && !sort && userId) {
    articleArray = await articleDao.retrieveArticlesByAuthorId(userId);
  } else if (sort && order && !userId) {
    articleArray = await articleDao.retrieveArticlesBySort(sort, order);
  } else {
    articleArray = await articleDao.retrieveArticlesByAuthorSort(
      userId,
      sort,
      order
    );
  }

  for (let i = 0; i < articleArray.length; i++) {
    const likeArray = await likeArticleDao.retrieveArticleLikes(
      articleArray[i].id
    );
    const commentArray = await commentDao.retrieveCommentByArticleId(
      articleArray[i].id
    );
    const popularity = commentArray.length + 2 * likeArray.length;
    articleArray[i].commentCount = commentArray.length;
    articleArray[i].likeCount = likeArray.lenght;
    articleArray[i].popularity = popularity;
    articleArray[i].likeCount = (popularity - commentArray.length) / 2;
  }

  res.json(articleArray);
});

router.get("/api/articleLikes", async function (req, res) {
  const articleId = req.query.articleId;
  const likeArray = await likeArticleDao.retrieveArticleLikes(articleId);
  res.json(likeArray);
});

router.get("/api/following", async function (req, res) {
  const userId = req.query.userId;
  const followingArray = await subscriptionDao.retrieveUserFollowingList(
    userId
  );
  res.json(followingArray);
});

router.get("/api/followers", async function (req, res) {
  const userId = req.query.userId;
  const followingArray = await subscriptionDao.retrieveUserFollowerList(userId);
  res.json(followingArray);
});

router.get("/api/commentPerDayForUser", async function (req, res) {
  const userId = req.query.userId;
  const data = await commentDao.retrieveCommentPerDayByAuthorId(userId);
  res.json(data);
});
//test...
router.get("/api", async function (req, res) {
    res.status(200).send('this is the 200 request page for API');
});
//API for log in
router.post("/api/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username)
  const passwordIsMatch = await passwordIsMatch(input, password);
  if (passwordIsMatch) {
    const user = await userDao.retrieveUserByUsername(username);
    const authToken = uuid();
    user.authToken = authToken;
    await userDao.updateUser(user);

    res.cookie("authToken", authToken);
    res.status(204).send();
  } else {
    res.status(401).send();
  }
});
//API logout

router.get("/api/logout", verifyAuthenticated, async function (req, res) {
  const user = res.locals.user;
  user.authToken = "";
  await userDao.updateUser(user);
  res.status(204).send();
});

//API users
router.get("/api/users", verifyAuthenticated, async function (req, res) {
  const user = res.locals.user;
  console.log(user);
  const administrator = user.administrator;
  if (administrator >= 2) {
    const userReport = await userDao.userReport();
    res.json(userReport);
  } else {
    res.status(401).send("Error, users could not be retrieved");
  }
});

//API userID
router.delete("/api/users/:userID",verifyAuthenticated,async function (req, res) {
    const user = res.locals.user;
    const targetUser = req.params.userID;
    console.log("TarfetUser received is : " + req.params.userID);
    if (user.userID != parseInt(targetUser)) {
      const administrator = user.administrator;
      if (administrator >= 2) {
        await commentDao.updateComment(targetUser);
        await articleDao.updateArticle(targetUser);
        await userDao.deleteUser(targetUser);

        res.status(204).send("user deleted");
      }
    }
  }
);
module.exports = router;
