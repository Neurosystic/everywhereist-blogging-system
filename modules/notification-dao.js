const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function registerNotification(obj){
    const db = await dbPromise;
    const result = await db.run(SQL`
        INSERT INTO notifications (actor_id, type, context, date_published, article_id, notifier_id) VALUES
            (${obj.actor_id}, ${obj.type}, ${obj.context}, ${obj.date_published}, ${obj.article_id}, ${obj.notifier_id})`);
    obj.id = result.lastID;
}

async function updateNotificationStatus(obj){
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

async function retrieveUserNotification(id){
    const db = await dbPromise;
    const result = await db.all(SQL`
        SELECT `)
}
