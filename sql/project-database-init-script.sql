/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

DROP TABLE IF EXISTS liked_comments;
DROP TABLE IF EXISTS liked_articles;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS subscription;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
	id INTEGER NOT NULL PRIMARY KEY,
	fname VARCHAR(100),
	lname VARCHAR(100),
	username VARCHAR(100) UNIQUE,
	hash_password TEXT,
	description TEXT,
	birth_date DATE, 
	email VARCHAR(100),
	authToken TEXT,
	avatar VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS articles (
	id INTEGER NOT NULL PRIMARY KEY,
	title TEXT,
	content TEXT,
	image TEXT,
	date_published DATETIME, 
	date_edited DATETIME,
	author_id INTEGER NOT NULL,
	FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscription (
	subscriber_id INTEGER,
	author_id INTEGER,
	PRIMARY KEY (subscriber_id, author_id),
	FOREIGN KEY (subscriber_id) REFERENCES users (id) ON DELETE CASCADE,
	FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
	id INTEGER NOT NULL PRIMARY KEY,
	content TEXT,
	date_published DATETIME,
	date_edited DATETIME,
	parent_comment_id INTEGER,
	article_id INTEGER,
	commenter_id INTEGER,
	FOREIGN KEY (parent_comment_id) REFERENCES comments (id) ON DELETE CASCADE,
	FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
	FOREIGN KEY (commenter_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS liked_articles (
	article_id INTEGER,
	user_id INTEGER,
	PRIMARY KEY (article_id, user_id),
	FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS liked_comments (
	comment_id INTEGER,
	user_id INTEGER,
	PRIMARY KEY (comment_id, user_id),
	FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
	
INSERT INTO users (fname, lname, username, hash_password, description, birth_date, email, authToken, avatar) VALUES
	-- Password = 123
	('Lily', 'Ansco', 'user1', '$2b$10$UjRNmIXscQ5fNDVUnjNw0eLEblMtoTogY9F68/nSEvFZv6O1cdQUW', 'Lorem Ipsum has been the industry standard dummy text ever since the 1500s', '1999-01-01', 'user1@gmail.com', NULL, 'avatar-4.jpg'),
	-- Password = 123
	('Lucy', 'Bees', 'user2', '$2b$10$zZ83DDqNqJGS3uKJ.JvHhOZQ4vqHCZkyY2hGqOvpaM8WOJpHxLcRK', 'There are many variations of passages of Lorem Ipsum available', '2000-02-01', 'user2@outlook.com', NULL, 'avatar-1.jpg'),
	-- Password 321
	('Poly', 'Humms', 'user3', '$2b$10$Y/jkljAjEW9GhPS3gfpKWum9ECv1364OmTzI3YZIgqmlIHVxGiVsi', 'The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet', '1996-11-25', 'user3@hellworld.com', NULL, 'avatar-5.jpg');
	
INSERT INTO articles (title, content, date_published, author_id) VALUES
	('What is Lorem Ipsum?', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2022-10-09 00:00:00', 1),
	('Why do we use it?', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', '2022-10-10 12:12:05', 2),
	('Where can I get some?', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words whichlook even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text.', '2022-09-28 23:00:10', 3);
	
INSERT INTO subscription VALUES 
	(2, 1),
	(3, 2),
	(1, 3);
	
INSERT INTO comments (content, date_published, parent_comment_id, article_id, commenter_id) VALUES
	('Great!', '2022-10-09 01:00:00', NULL, 1, 2),
	('Agree with that!', '2022-10-10 13:00:00', NULL, 1, 2),
	('LOL', '2022-10-01 16:00:00', NULL, 1, 3);

INSERT INTO liked_articles VALUES
	(1, 2),
	(1, 3),
	(2, 1);

INSERT INTO liked_comments VALUES
	(1, 2),
	(2, 1),
	(1, 3);

	
