const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function registerNotification(obj){
    const db = await dbPromise;
    const result = await db.run(SQL`
        INSERT INTO notifications (evoker_id, type, description, date_published, comment_id, article_id, subscribed_to) VALUES
            (${obj.evoker_id}, ${obj.type}, ${obj.description}, ${obj.date_published}, ${obj.comment_id}, ${obj.article_id}, ${obj.subscribed_to})`);
    obj.id = result.lastID;

    registerToSubscribers(obj);
}

async function registerToSubscribers(obj){
    const db = await dbPromise;

    if(obj.type == "article" || obj.type == "comment"){
        await db.run(SQL`
            INSERT INTO notify SELECT n.id, s.subscriber_id, s.author_id, NULL 
                FROM notifications AS n, subscription AS s 
                WHERE n.evoker_id = s.author_id AND (n.type = ${obj.type}) AND n.id = ${obj.id}`);
    } else if(obj.type == "follow"){
        await db.run(SQL`
            INSERT INTO notify SELECT n.id, u.id, n.evoker_id, NULL 
                FROM notifications AS n, users AS u 
                WHERE n.subscribed_to = u.id AND (n.type = ${obj.type}) AND n.id = ${obj.id}`);
    }
}

async function updateNotificationReadStatus(obj){
    const db = await dbPromise;
    await db.run(SQL`
        UPDATE notify SET is_read = 1
        WHERE notification_id = ${obj.notification_id} 
            AND receiver_id = ${obj.receiver_id} 
            AND evoker_id = ${obj.evoker_id}`);
}

async function retrieveUserNotifications(id){
    const db = await dbPromise;
    const result = await db.all(SQL`
        SELECT n.*, t.receiver_id, t.is_read, u.username, u.avatar FROM notifications AS n, notify AS t, users AS u
	        WHERE n.id = t.notification_id AND n.evoker_id = u.id AND receiver_id = ${id} ORDER BY n.date_published DESC`);
    return result;
}

module.exports = {
    registerNotification,
    updateNotificationReadStatus,
    retrieveUserNotifications
}