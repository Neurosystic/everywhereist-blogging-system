/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
DROP TABLE IF EXISTS notify;
DROP TABLE IF EXISTS notifications;
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
	date_subscription DATETIME,
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
	date_published DATETIME,
	PRIMARY KEY (article_id, user_id),
	FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS liked_comments (
	comment_id INTEGER,
	user_id INTEGER,
	date_published DATETIME,
	PRIMARY KEY (comment_id, user_id),
	FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
	id INTEGER NOT NULL PRIMARY KEY,
	evoker_id INTEGER NOT NULL,
	type TEXT,
	description TEXT,
	date_published DATETIME,
	comment_id INTEGER,
	article_id INTEGER,
	subscribed_to INTEGER,
	FOREIGN KEY (evoker_id) REFERENCES users (id),
	FOREIGN KEY (subscribed_to) REFERENCES users (id),
	FOREIGN KEY (comment_id) REFERENCES comments (id),
	FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE TABLE IF NOT EXISTS notify (
	notification_id INTEGER,
	receiver_id INTEGER, 
	evoker_id INTEGER,
	is_read NUMBER(1),
	PRIMARY KEY (notification_id, receiver_id, evoker_id),
	FOREIGN KEY (notification_id) REFERENCES notifications (id),
	FOREIGN KEY (receiver_id) REFERENCES users (id),
	FOREIGN KEY (evoker_id) REFERENCES users (id)
);
	
INSERT INTO users (fname, lname, username, hash_password, description, birth_date, email, authToken, avatar) VALUES
	-- Password = 123
	('Lily', 'Ansco', 'user1', '$2b$10$UjRNmIXscQ5fNDVUnjNw0eLEblMtoTogY9F68/nSEvFZv6O1cdQUW', 'Lorem Ipsum has been the industry standard dummy text ever since the 1500s', '1999-01-01', 'user1@gmail.com', NULL, 'avatar-4.jpg'),
	-- Password = 123
	('Lucy', 'Bees', 'user2', '$2b$10$zZ83DDqNqJGS3uKJ.JvHhOZQ4vqHCZkyY2hGqOvpaM8WOJpHxLcRK', 'There are many variations of passages of Lorem Ipsum available', '2000-02-01', 'user2@outlook.com', NULL, 'avatar-1.jpg'),
	-- Password 321
	('Poly', 'Humms', 'user3', '$2b$10$Y/jkljAjEW9GhPS3gfpKWum9ECv1364OmTzI3YZIgqmlIHVxGiVsi', 'The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet', '1996-11-25', 'user3@hellworld.com', NULL, 'avatar-5.jpg');
	
INSERT INTO articles (image, title, content, date_published, author_id) VALUES
	('boat.jpg', 'What is Lorem Ipsum?', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2022-10-09 00:00:00', 1),
	('plane.jpg', 'Why do we use it?', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', '2022-10-10 12:12:05', 2),
	('road.jpg', 'Where can I get some?', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words whichlook even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text.', '2022-09-28 23:00:10', 3);
	
INSERT INTO subscription VALUES 
	(2, 1, '2022-10-09 01:00:00'),
	(3, 1, '2022-10-01 16:00:00'),
	(1, 3, '2022-10-01 16:00:00');
	
INSERT INTO comments (content, date_published, parent_comment_id, article_id, commenter_id) VALUES
	('Great!', '2022-10-09 01:00:00', NULL, 1, 2),
	('Agree with that!', '2022-10-10 13:00:00', NULL, 1, 2),
	('LOL', '2022-10-01 16:00:00', NULL, 1, 3);

INSERT INTO liked_articles VALUES
	(1, 2, '2022-10-09 01:00:00'),
	(1, 3, '2022-10-09 01:00:00'),
	(2, 1, '2022-10-09 01:00:00');

INSERT INTO liked_comments VALUES
	(1, 2, '2022-10-09 01:00:00'),
	(2, 1, '2022-10-09 01:00:00'),
	(1, 3, '2022-10-09 01:00:00');
	
INSERT INTO notifications (evoker_id, type, description, date_published, comment_id, article_id, subscribed_to) VALUES 
	(1, 'article', 'posted a new article: title', '2022-10-09 00:00:00', NULL, 1, NULL),
	(1, 'follow', 'started following you', '2022-10-01 16:00:00', NULL, NULL, 2),
	(2, 'follow', 'started following you', '2022-10-09 01:00:00', NULL, NULL, 1),
	(3, 'follow', 'started following you', '2022-10-09 01:00:00', NULL, NULL, 2);

-- inserting article or comment related notifications 
INSERT INTO notify SELECT n.id, s.subscriber_id, s.author_id, NULL 
FROM notifications AS n, subscription AS s WHERE n.evoker_id = s.author_id AND (n.type = 'article' OR type = 'comment');
--inserting follow related notifications 
INSERT INTO notify SELECT n.id, u.id, n.evoker_id, NULL 
FROM notifications AS n, users AS u WHERE n.subscribed_to = u.id AND (n.type = 'follow');








-- testing code 
SELECT * FROM notify;

SELECT n.*, t.receiver_id, t.is_read, u.username, u.avatar FROM notifications AS n, notify AS t, users AS u
	WHERE n.id = t.notification_id AND n.evoker_id = u.id AND receiver_id = 1;
	
	
SELECT a.*, la.article_id, COUNT(la.article_id) AS likeCount FROM liked_articles AS la, articles AS a WHERE la.article_id = a.id GROUP BY la.article_id;

SELECT a.*, c.article_id, COUNT(c.article_id) AS commentCount FROM comments AS c, articles AS a WHERE c.article_id = a.id GROUP BY c.article_id;



		
		
		
		
		
		
		
		