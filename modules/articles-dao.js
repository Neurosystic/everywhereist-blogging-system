const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createArticle(article) {
  const db = await dbPromise;

  const result = await db.run(SQL`
        INSERT INTO articles (title, content, image, date_published, author_id) VALUES 
            (${article.title}, ${article.content}, ${article.image}, ${article.date_published}, ${article.author_id})`);

  article.id = result.lastID;
}

async function retrieveAllArticles() {
  const db = await dbPromise;

  const articles = await db.all(SQL`
        SELECT a.*, u.username, u.avatar FROM articles AS a, users AS u
        WHERE a.author_id = u.id`);

  return articles;
}

async function retrieveArticleById(id) {
  const db = await dbPromise;

  const article = await db.get(SQL`
        SELECT a.*, u.username, u.avatar FROM articles AS a, users AS u
            WHERE a.author_id = u.id AND a.id = ${id}`);

  return article;
}

async function retrieveArticlesBySort(condition, order) {
  const db = await dbPromise;

  return await db.all(`
        SELECT a.*, u.username, u.avatar FROM articles AS a, users AS u
	        WHERE a.author_id = u.id
	        ORDER BY ${condition} ${order}`);
}

async function retrieveArticlesByAuthorSort(id, condition, order) {
  const db = await dbPromise;

  return await db.all(`
        SELECT a.*, u.username, u.avatar FROM articles AS a, users AS u
            WHERE a.author_id = u.id AND u.id = ${id}
            ORDER BY ${condition} ${order}`);
}

async function retrieveArticlesByAuthorId(userId) {
  const db = await dbPromise;

  const articles = await db.all(SQL`
        SELECT a.*, u.username, u.avatar FROM articles AS a, users AS u
            WHERE a.author_id = u.id AND a.author_id = ${userId}`);

  return articles;
}

async function updateArticle(article) {
  const db = await dbPromise;

  await db.run(SQL`
        UPDATE articles SET
            title = ${article.title},
            content = ${article.content},
            image = ${article.image},
            date_published = ${article.date_published},
            date_edited = ${article.date_edited}, 
            author_id = ${article.author_id}
        WHERE id = ${article.id}`);
}

async function deleteArticle(id) {
  const db = await dbPromise;

  await db.run(SQL`
        DELETE FROM articles WHERE id = ${id}`);
}

module.exports = {
  createArticle,
  retrieveAllArticles,
  retrieveArticleById,
  retrieveArticlesBySort,
  retrieveArticlesByAuthorSort,
  retrieveArticlesByAuthorId,
  updateArticle,
  deleteArticle,
};
