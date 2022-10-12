const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createLikedComment(comment_id, user_id){
    const db = await dbPromise;

    await db.run(SQL`
        INSERT INTO liked_comments VALUES 
            (${comment_id},${user_id})`);
}

async function deleteLikedComment(comment_id, user_id){
    const db = await dbPromise;

    await db.run(SQL`
        DELETE FROM liked_comments 
            WHERE comment_id = ${comment_id} AND user_id = ${user_id}`);
}

async function retrieveCommentLikeCounts(comment_id){
    const db = await dbPromise;

    const result = await db.get(SQL`
        SELECT COUNT(*) FROM liked_comments
            WHERE comment_id = ${comment_id}`)
    return result;
}

async function retrieveAllCommentLikeCount(){
    const db = await dbPromise;

    const result = await db.all(SQL`
        SELECT comment_id, COUNT(*) FROM liked_comments
            GROUP BY comment_id`);
    return result;
}

module.exports = {
    createLikedComment,
    deleteLikedComment,
    retrieveAllCommentLikeCount,
    retrieveCommentLikeCounts
}