const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function registerSubscription(subscriber_id, author_id, time){
    const db = await dbPromise;

    await db.run(SQL`
        INSERT INTO subscription VALUES
            (${subscriber_id},${author_id}, ${time})`);
}

async function removeSubscription(subscriber_id, author_id){
    const db = await dbPromise;
    
    await db.run(SQL`
        DELETE FROM subscription 
            WHERE subscriber_id = ${subscriber_id} 
            AND author_id = ${author_id}`);

}

async function retrieveUserFollowerList(id){
    const db = await dbPromise;

    const result = await db.all(SQL`
        SELECT s.*, u.id, u.username, u.fname, u.lname, u.avatar 
            FROM subscription AS s, users AS u
            WHERE s.subscriber_id = u.id 
                AND s.author_id = ${id}`);

    return result;

}

async function retrieveUserFollowingList(id){
    const db = await dbPromise;

    const result = await db.all(SQL`
        SELECT s.*, u.id, u.username, u.fname, u.lname, u.avatar 
            FROM subscription AS s, users AS u
            WHERE s.author_id = u.id
                AND s.subscriber_id = ${id}`);
    return result;
}

module.exports = {
    registerSubscription,
    removeSubscription,
    retrieveUserFollowerList,
    retrieveUserFollowingList
}