const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function likeArticle(article, user){
    const db = await dbPromise;
    
    await db.run(SQL`
       INSERT INTO liked_articles (article_id, user_id) VALUES
            (${article.id},${user.id}) `);           

}

async function unlikeArticle(article,user){
    const db = await dbPromise;

    await db.run(SQL`
    DELETE FROM liked_articles WHERE article_id = ${article.id} AND user_id= ${user.id} `);           

}

async function getNumberofLikes(article){
    const db = await dbPromise;
    const result =  await db.run(SQL`SELECT COUNT(article_id) AS NumberOfLikes FROM liked_comments
                            WHERE srticle_id=${article.id}`);
   
    return result.getNumberofLikes;

}

module.exports = {
    likeArticle,
    unlikeArticle,
    getNumberofLikes
}