const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function likeComment(liked_comments, comments, users){
    const db = dbPromise;

    const result = await db.run(SQL`
    INSERT INTO liked_comments (comment_id, user_id) VALUES (${comments.id},${users.id})`);
    
    liked_comments = result.lastID;
}

async function unlikeComment (comment_id){
    const db = await dbPromise;

    await db.run(SQL`
    DELETE FROM liked_comments WHERE comment_id = ${comment_id}`);
}

async function countlike(comment_id){
    const db = dbPromise;

    const likesnum = await db.get(SQL`
    SELECT COUNT(comment_id) AS nums FROM liked_comments
    WHERE comment_id = ${comment_id}`)
    
    return likesnum;
}
module.exports = {
    likeComment,
    unlikeComment,
    countlike
}