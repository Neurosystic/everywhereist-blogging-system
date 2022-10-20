const userDao = require("../modules/users-dao.js");
const notificationDao = require("../modules/notification-dao.js");

async function addUserToLocals(req, res, next) {
  const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
  res.locals.user = user;
  if (user) {
    const notifications = await notificationDao.retrieveUserNotifications(
      user.id
    );
    res.locals.notificationArray = notifications;
    let unreadNotifications = 0;
    notifications.forEach(function (item) {
      if (item.is_read == null) {
        unreadNotifications++;
      }
    });
    res.locals.unread = unreadNotifications;
  }

  next();
}

async function verifyAuthenticated(req, res, next) {
  if (res.locals.user) {
    next();
  } else {
    res.redirect("./login");
  }
}

module.exports = {
  addUserToLocals,
  verifyAuthenticated
};
