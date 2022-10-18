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
	FOREIGN KEY (evoker_id) REFERENCES users (id) ON DELETE CASCADE,
	FOREIGN KEY (subscribed_to) REFERENCES users (id) ON DELETE CASCADE,
	FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE,
	FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notify (
	notification_id INTEGER,
	receiver_id INTEGER, 
	evoker_id INTEGER,
	is_read NUMBER(1),
	PRIMARY KEY (notification_id, receiver_id, evoker_id),
	FOREIGN KEY (notification_id) REFERENCES notifications (id) ON DELETE CASCADE,
	FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE,
	FOREIGN KEY (evoker_id) REFERENCES users (id) ON DELETE CASCADE
);
	
INSERT INTO users (fname, lname, username, hash_password, description, birth_date, email, authToken, avatar) VALUES
	-- Password = 123
	('Lily', 'Ansco', 'user1', '$2b$10$UjRNmIXscQ5fNDVUnjNw0eLEblMtoTogY9F68/nSEvFZv6O1cdQUW', 'Lorem Ipsum has been the industry standard dummy text ever since the 1500s', '1999-01-01', 'user1@gmail.com', NULL, 'avatar-4.jpg'),
	-- Password = 123
	('Lucy', 'Bees', 'user2', '$2b$10$zZ83DDqNqJGS3uKJ.JvHhOZQ4vqHCZkyY2hGqOvpaM8WOJpHxLcRK', 'There are many variations of passages of Lorem Ipsum available', '2000-02-01', 'user2@outlook.com', NULL, 'avatar-1.jpg'),
	-- Password = 321
	('Poly', 'Humms', 'user3', '$2b$10$Y/jkljAjEW9GhPS3gfpKWum9ECv1364OmTzI3YZIgqmlIHVxGiVsi', 'The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet', '1996-11-25', 'user3@hellworld.com', NULL, 'avatar-5.jpg'),
	-- Password = 123
	('Arthur', 'Huang', 'user4', '$2b$10$zZ83DDqNqJGS3uKJ.JvHhOZQ4vqHCZkyY2hGqOvpaM8WOJpHxLcRK', 'Silver, curly hair almost fully covers a craggy, friendly face', '1994-06-30', 'user4@gmail.com', NULL, 'avatar-3.jpg'),
	-- Password = 123
	('Justina', 'Huang', 'user5', '$2b$10$zZ83DDqNqJGS3uKJ.JvHhOZQ4vqHCZkyY2hGqOvpaM8WOJpHxLcRK', 'Blonde, shoulder-length hair almost fully covers a lean, sad face', '1995-12-08', 'user5@outlook.com', NULL, 'avatar-2.jpg'),
	-- Password = 321
	('Richard', 'Hunag', 'user6', '$2b$10$Y/jkljAjEW9GhPS3gfpKWum9ECv1364OmTzI3YZIgqmlIHVxGiVsi', 'Small green eyes, set wickedly within their sockets, watch honorably over the lands they have shown mercy on for so long', '1997-10-08', 'user6@hellworld.com', NULL, 'avatar-6.jpg'),
	-- Password = 123
	('John', 'Huang', 'user7', '$2b$10$UjRNmIXscQ5fNDVUnjNw0eLEblMtoTogY9F68/nSEvFZv6O1cdQUW', 'Silver, greasy hair slightly covers a skinny, radiant face', '1949-01-16', 'user7@gmail.com', NULL, 'avatar-7.jpg'),
	-- Password = 123
	('Michelle', 'Huang', 'user8', '$2b$10$zZ83DDqNqJGS3uKJ.JvHhOZQ4vqHCZkyY2hGqOvpaM8WOJpHxLcRK', 'Chestnut, dreadlocks gently hangs over a lean, worried face', '1963-06-21', 'user8@outlook.com', NULL, 'avatar-9.jpg'),
	-- Password = 321
	('Eason', 'Huang', 'user9', '$2b$10$Y/jkljAjEW9GhPS3gfpKWum9ECv1364OmTzI3YZIgqmlIHVxGiVsi', 'Light blue, shaggy hair neatly coiffured to reveal a lean, time-worn face', '2010-05-20', 'user9@hellworld.com', NULL, 'avatar-8.jpg'),
	-- Password = 123
	('yozhi', 'Huang', 'user10', '$2b$10$UjRNmIXscQ5fNDVUnjNw0eLEblMtoTogY9F68/nSEvFZv6O1cdQUW', 'Gray, shaggy hair is pulled back to reveal a thin, cheerful face', '2020-02-14', 'user10@gmail.com', NULL, 'avatar-4.jpg');
	
INSERT INTO articles (image, title, content, date_published, author_id) VALUES
	('boat.jpg', 'Testing', 'Testing content', '2022-10-09 01:00:00', 1),
	('boat.jpg', 'What is Lorem Ipsum?', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2022-10-09 00:00:00', 1),
	('plane.jpg', 'Why do we use it?', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', '2022-10-10 12:12:05', 2),
	('boat.jpg','test','teste12312rt837r6873468736875','2022-10-04 10:12:00',1),
	('road.jpg', 'Where can I get some?', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words whichlook even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text.', '2022-09-28 23:00:10', 3),
	('hero.jpeg', 'What is Love?', 'The world before the railways appeared so very different from what came afterward and from what we know today because the railways did more than just facilitate travel and thereby change the way the world was seen and depicted. They transformed the very landscape itself.', '2022-10-11 12:00:00', 1),
	('Gamble.png', 'What is Life?', 'It is simply not possible to envision any conceivable modern, urban-based economy shorn of its subways, its tramways, its light rail and suburban networks, its rail connections, and its intercity links', '2022-10-12 10:10:10', 2),
	('Sam.png','To be or not to be','This page shares my best articles to read on topics like health, happiness, creativity, productivity and more. The central question that drives my work is, “How can we live better?” To answer that question, I like to write about science-based ways to solve practical problems.','2022-10-11 09:09:09',1),
	('Top hero.jpg', 'What is your name', 'You’ll find interesting articles to read on topics like how to stop procrastinating as well as personal recommendations like my list of the best books to read and my minimalist travel guide. Ready to dive in? You can use the categories below to browse my best articles.', '2022-10-11 08:08:08', 3),
	('Vegan.jpg', 'Why Vegan?', 'Last night — just hours ago — I was the guy in a huge movie that everyone was talking about, the guy who made out with a glamorous beauty, a guy with a fine ass. In the capitals of Europe — and America — I was hustled around like a politician, into cars and into ballrooms filled with camera-totin’, question-hollerin’ reporters. I waved to seas of people, many of whom waved back, even though no one knew who I am, even though I am, in fact, a no one. Although, I have in my possession … certain documents … that reveal Willa Sax’s TOP-SECRET CODE NAME (it’s Eleanor Flintstone!).', '2022-10-14 10:11:12', 1),
	('cat.jpg', 'What is cat?', 'A good rule of thumb when traveling in Europe — stay in places with a Nazi past. The place in Rome had been Gestapo headquarters during the war. Big rooms. High ceilings. A beautiful garden. In Berlin, the hotel had been leveled when the Russians clobbered the Nazis who were hiding in it. To rub in their victory, the Commies never bothered to rebuild it or much of anything else in that part of East Berlin. When the wall came down, the hotel went back up, and now the joint has a special room just for smoking cigars. In London, the old lady of a grand hotel had been bombed by the Luftwaffe sometime between the Nazi glories of Rome and the ass-kicking they took from the Reds a few years later. The Queen has had dinner there twice since 1973.', '2022-10-15 05:10:15', 3),
	('evilcat.jpg','Cat is evil','We know you must be exhausted but want you to know how thrilled we all are to be working on the French release of CASSANDRA RAMPART 3: DESTINY AT HAND! Our colleagues in Rome, Berlin and London tell us the movie has been welcomed with wild enthusiasm … thanks to you! Our tracking numbers are strong, just three points off CASSANDRA RAMPART 2: AGENT OF CHANGE and only 10 points off CASSANDRA RAMPART: THE BEGINNING. For a sequel, these are fantastic numbers! It seems audiences are responding to the sexual tension between Cassandra and Caleb.','2022-10-16 06:12:18',3),
	('adorablecat.jpg', 'Cat is also adorable', 'As Irene Burton and the Marketing Dept. may have already explained to you, France does not allow the promotion of films via paid spots on television — which is why you may notice a few more on-camera interviews during your stay with us. These interviews are crucial in the French market. You have done so well on the U.S. tour and in Rome/Berlin/London that there is no question you are warmed up! So have fun!', '2022-10-17 11:22:33', 3);
	
INSERT INTO subscription VALUES 
	(2, 1, '2022-10-09 01:00:00'),
	(3, 1, '2022-10-01 16:00:00'),
	(1, 3, '2022-10-01 16:00:00'),
	(5, 1, '2022-10-10 01:00:00'),
	(7, 1, '2022-10-11 10:00:00'),
	(4, 3, '2022-10-11 12:00:00'),
	(6, 1, '2022-10-11 04:00:00'),
	(8, 1, '2022-10-12 06:00:00'),
	(9, 3, '2022-10-12 08:00:00'),
	(10, 1, '2022-10-13 21:00:00'),
	(3, 9, '2022-10-14 13:00:00'),
	(2, 3, '2022-10-15 15:00:00');
	
INSERT INTO comments (content, date_published, parent_comment_id, article_id, commenter_id) VALUES
	('Great!', '2022-10-09 01:00:00', NULL, 1, 2),
	('Agree with that!', '2022-10-10 13:00:00', NULL, 1, 2),
	('LOL', '2022-10-01 16:00:00', NULL, 1, 3),
	('LMAO', '2022-10-11 21:00:00', NULL, 1, 3),
	('All good', '2022-10-12 13:00:00', NULL, 1, 5),
	('Crazy', '2022-10-13 16:00:00', NULL, 1, 6),
	('wwwww', '2022-10-14 01:00:00', NULL, 2, 3),
	('Nice to meet you', '2022-10-15 13:00:00', NULL, 2, 4),
	('I am fine thank you, and you?', '2022-10-13 16:00:00', NULL, 2, 5),
	('Ahahahaha', '2022-10-15 01:00:00', NULL, 2, 4),
	('Stop', '2022-10-10 14:00:00', NULL, 2, 6),
	('Who are you', '2022-10-09 16:00:00', NULL, 2, 3);

INSERT INTO liked_articles VALUES
	(1, 2, '2022-10-09 01:00:00'),
	(1, 3, '2022-10-09 02:00:00'),
	(3,2,'2022-10-04 10:12:00'),
	(2, 1, '2022-10-15 06:00:00'),
	(2, 6, '2022-10-12 03:00:00'),
	(3, 4, '2022-10-13 04:00:00'),
	(1,4,'2022-10-13 15:12:00'),
	(3, 5, '2022-10-12 07:00:00'),
	(2, 7, '2022-10-15 20:00:00'),
	(3, 6, '2022-10-11 18:00:00'),
	(1,8,'2022-10-12 14:12:00'),
	(2, 9, '2022-10-11 11:00:00');


INSERT INTO liked_comments VALUES
	(1, 2, '2022-10-09 01:00:00'),
	(2, 1, '2022-10-09 01:00:00'),
	(1, 3, '2022-10-09 01:00:00'),
	(9, 2, '2022-10-14 01:00:00'),
	(9, 1, '2022-10-14 08:00:00'),
	(1, 5, '2022-10-09 06:00:00'),
	(9, 6, '2022-10-14 13:00:00'),
	(2, 5, '2022-10-09 15:00:00'),
	(9, 3, '2022-10-14 17:00:00'),
	(4, 2, '2022-10-12 10:00:00'),
	(3, 1, '2022-10-09 09:00:00'),
	(6, 3, '2022-10-15 04:00:00');
	
INSERT INTO notifications (evoker_id, type, description, date_published, comment_id, article_id, subscribed_to) VALUES 
	(1, 'article', 'posted a new article: title', '2022-10-09 00:00:00', NULL, 1, NULL),
	(1, 'follow', 'started following you', '2022-10-01 16:00:00', NULL, NULL, 2),
	(2, 'follow', 'started following you', '2022-10-09 01:00:00', NULL, NULL, 1),
	(3, 'follow', 'started following you', '2022-10-09 01:00:00', NULL, NULL, 2),
	(3, 'article', 'posted a new article: title', '2022-10-14 00:00:00', NULL, 1, NULL),
	(4, 'follow', 'started following you', '2022-10-11 16:00:00', NULL, NULL, 2),
	(4, 'follow', 'started following you', '2022-10-13 01:00:00', NULL, NULL, 1),
	(5, 'follow', 'started following you', '2022-10-11 01:00:00', NULL, NULL, 2),
	(3, 'article', 'posted a new article: title', '2022-10-13 00:00:00', NULL, 1, NULL),
	(9, 'follow', 'started following you', '2022-10-14 16:00:00', NULL, NULL, 2),
	(5, 'follow', 'started following you', '2022-10-10 01:00:00', NULL, NULL, 1),
	(6, 'follow', 'started following you', '2022-10-15 01:00:00', NULL, NULL, 2);

-- inserting article or comment related notifications 
INSERT INTO notify SELECT n.id, s.subscriber_id, s.author_id, NULL 
FROM notifications AS n, subscription AS s WHERE n.evoker_id = s.author_id AND (n.type = 'article' OR type = 'comment');
--inserting follow related notifications 
INSERT INTO notify SELECT n.id, u.id, n.evoker_id, NULL 
FROM notifications AS n, users AS u WHERE n.subscribed_to = u.id AND (n.type = 'follow');

