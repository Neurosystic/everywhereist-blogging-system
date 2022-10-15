const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function registerNotification(obj){
    const db = await dbPromise;
    const result = await db.run(SQL`
        INSERT INTO notifications (actor_id, type, context, date_published, article_id, notifier_id, comment_id) VALUES
            (${obj.actor_id}, ${obj.type}, ${obj.context}, ${obj.date_published}, ${obj.article_id}, ${obj.notifier_id}, ${obj.comment_id})`);
    obj.id = result.lastID;
}

async function updateNotification(obj){
    const db = await dbPromise;
    await db.run(SQL`
        UPDATE notifications SET 
            actor_id = ${obj.actor_id},
            type = ${obj.type},
            context = ${obj.context},
            date_published = ${obj.date_published},
            article_id = ${obj.article_id},
            notifier_id = ${obj.notifier_id},
            status = ${obj.status}
        WHERE id = ${obj.id}`);
}

async function retrieveAllNotification(id){
    const db = await dbPromise;
    const result = await db.all(SQL`
        SELECT n.actor_id, u.username, u.avatar, n.type, n.context, n.date_published, n.article_id, n.comment_id, n.status 
        FROM notifications AS n, users AS u
        WHERE n.actor_id=u.id`);
    return result;
}

module.exports ={
    registerNotification,
    updateNotification,
    retrieveAllNotification
}