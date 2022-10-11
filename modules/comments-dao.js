const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createComment(comment){
    const db = await dbPromise;
    
    const result = await db.run(SQL`
        INSERT INTO comments (content, date_published, parent_comment_id, article_id, commenter_id) VALUES
            (${comment.content}, ${comment.date_published}, ${comment.parent_comment_id}, ${comment.article_id}, ${comment.commenter_id}`);
    
    comment.id = result.lastID;
}

async function retrieveCommentsByCommenterId(id){
    const db = await dbPromise;

    const comments = await db.all(SQL`
        SELECT * FROM comments WHERE commenter_id = ${id}`);
    
    return comments;
}

async function retrieveCommentByArticleId(id){
    const db = await dbPromise;

    const comments = await db.all(SQL`
        SELECT * FROM comments WHERE article_id = ${id}`);
    
    return comments;
}

async function retrieveAllComments(){
    const db = await dbPromise;

    const comments = await db.all(SQL`
        SELECT * FROM comments`);
    
    return comments;
}

async function updateComment(comment){
    const db = await dbPromise;

    await db.run(SQL`
        UPDATE comments SET
            content = ${comment.content},
            date_published = ${comment.date_published},
            date_edited = ${comment.date_edited},
            parent_comment_id = ${comment.parent_comment_id},
            article_id = ${comment.article_id},
            commenter_id = ${commenter_id}
        WHERE id = ${comment.id}`);
}

async function deleteComment(id){
    const db = await dbPromise;

    await db.run(SQL`
        DELETE FROM comments WHERE id = ${id}`);
}

module.exports = {
    createComment,
    retrieveAllComments,
    retrieveCommentByArticleId,
    retrieveCommentsByCommenterId,
    updateComment,
    deleteComment
}