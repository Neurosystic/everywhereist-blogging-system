/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */

 drop table if exists like_comments;
drop table if exists comments_nests;
drop table if exists comments;
drop table if exists like_articles;
drop table if exists articles;
drop table if exists subscription;
drop table if exists users;




create table users (
    users_id integer primary key,
    birthday date,
	user_password varchar(30),
	lname varchar(30),
	fname varchar(30),
	bio	TEXT,
	email varchar(30)
);

create table subscription (
    sub_user_id integer primary key,
	followers_id integer,
	FOREIGN KEY (sub_user_id) REFERENCES users (users_id),
	FOREIGN KEY (followers_id) REFERENCES users (users_id)
	
);

create table articles (
    articles_id integer primary key,
    publish_date integer,
	Content TEXT,
	Title	TEXT,
	author TEXT,
	FOREIGN KEY (author) REFERENCES users (users_id)
);

create table like_articles (
    likes_user_id integer primary key,
	liked_articles_id integer,
	FOREIGN KEY (likes_user_id) REFERENCES users (users_id),
	FOREIGN KEY (liked_articles_id) REFERENCES articles (articles_id)
);

create table comments (
    comment_id integer  primary key,
	article_refference_id integer,
    publish_date integer,
	Content TEXT,
	author integer ,
	FOREIGN KEY (author) REFERENCES users (users_id),
	FOREIGN KEY (article_refference_id) REFERENCES articles (articles_id)
	
);

create table comments_nests (
    comment_id integer  primary key,
	parent_comment_id integer,
	FOREIGN KEY (comment_id) REFERENCES comments (comment_id),
	FOREIGN KEY (parent_comment_id) REFERENCES comments (comment_id)
	
);

create table like_comments (
    likes_user_id integer  primary key,
	liked_comments_id integer,
	FOREIGN KEY (likes_user_id) REFERENCES users (users_id),
	FOREIGN KEY (liked_comments_id) REFERENCES comments (comment_id)
);




