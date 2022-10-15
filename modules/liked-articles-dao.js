const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function registerArticleLiked(article_id, user_id){
    const db = await dbPromise;
    
    await db.run(SQL`
        INSERT INTO liked_articles VALUES
            (${article_id}, ${user_id})`);           
}

async function removeArticleLiked(article_id, user_id){
    const db = await dbPromise;

    await db.run(SQL`
        DELETE FROM liked_articles 
            WHERE article_id = ${article_id} 
            AND user_id = ${user_id}`);           
}

async function retrieveArticleLikes(article_id){
    const db = await dbPromise;

    const result = await db.all(SQL`
        SELECT * FROM liked_articles
            WHERE article_id = ${article_id}`); //unsure of how to read the data
    return result;
}

async function retrieveAllArticleLikeCount(){
    const db = await dbPromise;

    const result = await db.all(SQL`
        SELECT article_id, COUNT(*) FROM liked_articles
            GROUP BY article_id`);

    return result;
}

async function retrieveUserTotalLikesReceived(id){
    const db = await dbPromise;

    const result = await db.all(SQL`
        SELECT l.*, a.id, a.author_id
            FROM liked_articles AS l, articles AS a
            WHERE l.article_id = a.id 
                AND a.author_id = ${id}`);

    return result;
}

module.exports = {
    registerArticleLiked,
    removeArticleLiked,
    retrieveArticleLikes,
    retrieveAllArticleLikeCount,
    retrieveUserTotalLikesReceived
}