const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function subscribe(subscription, users){
    const db = dbPromise;

    const result = await db.run(SQL`
    INSERT INTO subscription(subscriber_id, author_id) VALUES(${users.id},${users.id})`);


    subscription = result.lastID;
}

async function unsubscribe(subscriber_id){
    const db = dbPromise;
    
    await db.run(SQL`
    DELETE FROM subscription WHERE subscriber_id = ${subscriber_id}`);

}

async function countfollower(subscriber_id){
    const db = dbPromise;

    const followernums = await db.get(SQL`
    SELECT COUNT(subscriber_id) AS nums FROM subscription
    WHERE subscriber_id = ${subscriber_id} `)

    return followernums;

}

module.exports = {
    subscribe,
    unsubscribe,
    countfollower
}