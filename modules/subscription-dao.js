const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function registerSubscription(subscriber_id, author_id){
    const db = await dbPromise;

    await db.run(SQL`
        INSERT INTO subscription VALUES
            (${subscriber_id},${author_id})`);
}

async function removeSubscription(subscriber_id, author_id){
    const db = await dbPromise;
    
    await db.run(SQL`
        DELETE FROM subscription 
            WHERE subscriber_id = ${subscriber_id} AND author_id = ${author_id}`);

}

async function retrieveAuthorFollowerCount(author_id){
    const db = await dbPromise;

    const result = await db.get(SQL`
        SELECT COUNT(*) FROM subscription
            WHERE author_id = ${author_id}`);

    return result;

}

async function retrieveAllAuthorFollowerCount(){
    const db = await dbPromise;

    const result = await db.all(SQL`
        SELECT author_id, COUNT(*) FROM subscription
            GROUP BY author_id`);
}

module.exports = {
    registerSubscription,
    removeSubscription,
    retrieveAuthorFollowerCount,
    retrieveAllAuthorFollowerCount
}