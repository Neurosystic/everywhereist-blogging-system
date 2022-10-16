const userDao = require("../modules/users-dao.js");
const notificationDao = require("../modules/notification-dao.js");

async function addUserToLocals(req, res, next){
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    const notifications = await notificationDao.retrieveUserNotifications(user.id);
    res.locals.notifications = notifications;
    next();
}

function verifyAuthenticated(req, res, next){
    if(res.locals.user){
        next();
    } else {
        res.redirect("./login");
    }
}

module.exports = {
    addUserToLocals,
    verifyAuthenticated
}