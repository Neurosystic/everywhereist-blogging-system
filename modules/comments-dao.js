const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createComment(comment){
    const db = await dbPromise;
    
    const result = await db.run(SQL`
        INSERT INTO comments (content, date_published, parent_comment_id, article_id, commenter_id) VALUES
            (${comment.content}, ${comment.date_published}, ${comment.parent_comment_id}, ${comment.article_id}, ${comment.commenter_id})`);
    
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
        SELECT c.*, u.username, u.avatar 
            FROM comments AS c, users AS u
	        WHERE c.commenter_id = u.id 
                AND c.article_id=${id}`);
    
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

async function retrieveUserTotalCommentReceived(id){
    const db = await dbPromise;

    const comments = await db.all(SQL`
        SELECT c.*, a.id, a.author_id
            FROM comments AS c, articles AS a
            WHERE c.article_id = a.id 
                AND a.author_id = ${id}`);
    
    return comments;
}

async function countCommentsByID(id){
    
    const db = await dbPromise;
    
    const commentNumsEachday = await db.get(SQL`
        SELECT count (commenter_id), date_published FROM comments
        WHERE article_id = ${id}
        GROUP BY date (date_published) 
    
    `)

    
    return commentNumsEachday;
}

async function countCommentTenDays(){
    
    const db = await dbPromise;
    
    const date = await db.get(SQL`
    SELECT date_published FROM comments
    WHERE comments.date_published >=  date ('now','-10 days')
    
    `)
        return date;
}


module.exports = {
    createComment,
    retrieveAllComments,
    retrieveCommentByArticleId,
    retrieveCommentsByCommenterId,
    updateComment,
    deleteComment,
    retrieveUserTotalCommentReceived,
    countCommentsByID,
    countCommentTenDays
}