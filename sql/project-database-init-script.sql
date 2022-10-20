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
	is_admin NUMBER(1),
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


-- INSERTING DATA INTO DATABASE
	
INSERT INTO users (is_admin,fname, lname, username, hash_password, description, birth_date, email, authToken, avatar) VALUES
	-- Password = 123
	(1,'Lily', 'Ansco', 'user1', '$2b$10$UjRNmIXscQ5fNDVUnjNw0eLEblMtoTogY9F68/nSEvFZv6O1cdQUW', 'Lorem Ipsum has been the industry standard dummy text ever since the 1500s', '1999-01-01', 'user1@gmail.com', NULL, 'avatar-4.jpg'),
	-- Password = 321
	(NULL,'Poly', 'Humms', 'user3', '$2b$10$Y/jkljAjEW9GhPS3gfpKWum9ECv1364OmTzI3YZIgqmlIHVxGiVsi', 'The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet', '1996-11-25', 'user3@hellworld.com', NULL, 'avatar-5.jpg'),
	-- Password = happyDays
	(NULL,'Angie', 'Bethell', 'bethbeth', '$2b$10$hDA4T2AxGNgj.s7bdC4OFOA9YBH4Mc5JDLRGPNU3dWF5DdlvvmjEW', 'Blonde, shoulder-length hair almost fully covers a lean, sad face', '1995-12-08', 'user5@outlook.com', NULL, 'avatar-2.jpg'),
	-- Password = tiredTired
	(NULL,'Poppy', 'Young', 'appleBerryPie', '$2b$10$2aSZRJNw0zm1g3hJm2Q5POdxkTNooYyEJIRWVkyeZ0SgiMtmjkRKu', 'Small green eyes, set wickedly within their sockets, watch honorably over the lands they have shown mercy on for so long', '1997-10-08', 'user6@hellworld.com', NULL, 'avatar-6.jpg'),
	-- Password = wohoo123
	(NULL,'Harris', 'Moree', 'givemeMore', '$2b$10$j65ETuZXMqEkM7WUGnhjI.NPPyVgMM1HkHFNtc9CTixKpyHzGO5zC', 'Silver, greasy hair slightly covers a skinny, radiant face', '1949-01-16', 'user7@gmail.com', NULL, 'avatar-7.jpg');

INSERT INTO articles (image, title, content, date_published, author_id) VALUES
	('boat.jpg', 'Nature and Life', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fringilla, nisl ut molestie convallis, nulla ex pharetra felis, eu auctor nisi risus vestibulum dui. Praesent iaculis arcu sit amet ante fermentum, a suscipit orci aliquam. Vivamus eu enim dignissim mauris elementum fringilla sit amet vitae urna. Nam volutpat nunc eu felis maximus volutpat. Etiam scelerisque sit amet urna sed interdum. Curabitur massa neque, rhoncus dictum mi vel, tincidunt interdum arcu. In nibh purus, dignissim sed molestie a, malesuada at purus. Morbi eu ligula id quam condimentum mollis. <br>Nunc suscipit enim vel laoreet facilisis. Cras placerat odio et leo blandit sollicitudin. Vivamus pharetra, odio quis condimentum vehicula, est nisl vestibulum risus, ac mattis est nunc tristique dolor. Aliquam cursus nulla sit amet congue tristique. Donec cursus, tortor id vestibulum sagittis, diam augue posuere neque, ac pharetra urna mi vel lacus. Etiam ac blandit leo. Nulla iaculis viverra ullamcorper. Donec eget risus consequat, porta odio eu, lacinia dui. Pellentesque varius tempus tellus a blandit. Nullam quis feugiat ligula, vitae pharetra ligula. Praesent blandit porta ex, ac sodales magna blandit et. <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut nulla scelerisque metus rhoncus semper. Suspendisse sit amet quam sit amet ex sollicitudin dignissim. Sed non volutpat nibh. Morbi a lorem varius, accumsan arcu in, ullamcorper arcu. Nullam semper dictum sapien sit amet efficitur. In varius maximus libero malesuada semper. Phasellus quis velit quis nulla porttitor elementum. Proin non mauris at libero convallis tincidunt sit amet in erat. Nullam nibh eros, pellentesque ut erat sit amet, mattis bibendum turpis. Aenean porttitor at felis sit amet vehicula. Nunc vestibulum pretium scelerisque. Nulla arcu mauris, sagittis a rhoncus at, aliquet ut eros. Donec sit amet sem vehicula elit scelerisque sodales id non dolor. Maecenas non nisl tellus. Integer tincidunt est at odio tempor fringilla.<br>Suspendisse placerat neque nisl, quis mollis massa rhoncus vitae. Donec at turpis odio. Nam tempus vehicula nisl quis vulputate. Curabitur nec risus et ligula aliquet facilisis non nec risus. Ut porta rhoncus posuere. Vestibulum nec nulla dapibus, scelerisque enim quis, auctor velit. Curabitur arcu lectus, pellentesque non pharetra a, congue at tortor. Maecenas hendrerit ex eu mollis ullamcorper. Maecenas euismod dolor quis est tempor vestibulum. Morbi volutpat tortor mi, id tempor eros molestie commodo. Sed nisl sapien, ultricies in blandit sit amet, pretium id sem. Cras lectus leo, ullamcorper sed commodo vel, blandit in libero. Ut ut luctus nisi.<br>Maecenas a urna scelerisque metus mattis viverra in eu orci. Vivamus luctus nulla ut mauris accumsan interdum. Curabitur aliquet sed felis nec cursus. Donec consequat ex sed auctor sodales. Sed posuere facilisis porttitor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec et mi nisl.', '2022-10-09 00:00:00', 1),
	('plane.jpg', 'Where am I now?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lacinia, lacus at condimentum interdum, massa massa suscipit urna, vitae efficitur tortor eros non libero. Integer vehicula nibh diam, quis luctus turpis sagittis eu. Aliquam dictum, tellus non accumsan accumsan, enim massa commodo urna, at facilisis lectus sem in urna. Cras scelerisque turpis non risus congue varius. Suspendisse in sapien eu sapien maximus aliquam vitae ut neque. Integer convallis neque eget mauris rutrum varius. Quisque scelerisque tempus ipsum nec porta. Curabitur bibendum in purus et mattis. Pellentesque neque elit, ornare ut consectetur at, ornare ut massa. Etiam tincidunt leo urna, et aliquam diam molestie sed. Aenean elementum erat ut lacus volutpat, in posuere erat laoreet.', '2022-10-10 12:12:05', 2),
	('road.jpg', 'Exploring nature', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu pellentesque tortor. Cras molestie id ipsum ut scelerisque. Praesent nec imperdiet lacus. Suspendisse potenti. Duis ut sodales magna. Aliquam varius metus mi, ut lacinia tortor convallis sit amet. Donec eu feugiat enim. Pellentesque vitae ultricies nisi, ut imperdiet quam. <br><br>Etiam consequat sapien ut ullamcorper malesuada. Duis bibendum, diam et euismod consectetur, justo sapien scelerisque nibh, ut elementum neque ligula a risus. Donec eget turpis mi. Curabitur at hendrerit nulla, eget tincidunt risus. Quisque et turpis tincidunt, pellentesque mauris vitae, eleifend augue. Praesent lacus tortor, pharetra sit amet rutrum ut, hendrerit hendrerit neque. Donec viverra mi quis nunc varius, quis malesuada leo pellentesque. Suspendisse molestie diam sed massa ullamcorper vestibulum. Sed gravida, mauris at lobortis efficitur, diam sapien egestas est, placerat aliquet est justo commodo massa. Aenean sodales eros tortor, at porta diam fringilla ac. Proin enim erat, rutrum eget aliquet ultrices, blandit nec neque. Cras sit amet est et urna imperdiet porta in id dui. Vivamus id nisi eu ex dignissim posuere. Donec sodales dolor vel eros fringilla pretium. Cras pulvinar risus mauris, quis porttitor augue tincidunt sit amet. Maecenas condimentum imperdiet turpis ut vestibulum.<br><br>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi dignissim imperdiet neque sit amet lobortis. Vivamus tempor enim augue, quis vehicula purus commodo eu. Ut mattis lacus odio, a ornare purus vehicula ullamcorper. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris id dictum magna. Quisque vel augue tellus. Sed leo augue, pretium vitae aliquam congue, maximus in sapien. Quisque lobortis hendrerit efficitur. Maecenas quis purus at velit congue finibus in non tellus. Praesent lobortis lorem id nisl sodales rhoncus. Aenean sit amet suscipit ligula.<br><br>Mauris tincidunt non metus id fermentum. Sed molestie lacus et ex cursus aliquet. Proin enim sapien, sagittis vel velit quis, eleifend dictum sem. Nunc pellentesque at augue non semper. Donec ligula nisl, feugiat ut leo et, imperdiet efficitur ipsum. Etiam ultricies venenatis est at elementum. Donec tincidunt neque vitae semper congue. Sed in ultricies risus. Quisque viverra eros diam, nec mollis diam vehicula id. Mauris eu tortor et ante placerat sagittis id sed odio. Nam vestibulum, sapien at tincidunt consectetur, justo eros dictum metus, sed convallis velit ligula quis mi. Mauris non malesuada nisi, suscipit efficitur turpis. Etiam quis urna pulvinar, vestibulum velit id, aliquam diam. Donec tempor feugiat nulla vitae vehicula. Aliquam erat volutpat.<br><br>Etiam sodales ultrices neque eget posuere. Aenean semper, mauris eu rutrum dictum, leo tellus molestie magna, sed sollicitudin magna urna ut metus. Aenean mi lorem, pretium sit amet felis sit amet, rutrum aliquam nunc. Morbi consequat arcu vel ante aliquam, pretium eleifend massa lacinia. In at neque vitae nunc egestas tempus a at lorem. Ut vel feugiat tortor, sagittis semper quam. Nulla ullamcorper ullamcorper lacus ac lobortis.<br><br>Mauris sit amet felis suscipit, scelerisque leo in, porta neque. Maecenas laoreet interdum mauris id consequat. Donec feugiat leo a nisl fermentum convallis. Sed et varius ligula, viverra imperdiet massa. Ut rutrum lacus vel cursus sollicitudin. Praesent convallis massa at libero luctus, ac vestibulum metus cursus. Nullam viverra turpis vitae mauris gravida, a vehicula lorem vehicula. Integer finibus magna sem, vel lobortis ipsum porta eget. Donec et tempor turpis. In faucibus orci vel auctor sollicitudin. Quisque fringilla, nibh et molestie tincidunt, quam augue sodales urna, id rhoncus felis dui a metus. In ut laoreet est. Proin fringilla urna hendrerit purus consectetur condimentum. Praesent tristique, augue a rhoncus tristique, nulla felis elementum lectus, sed hendrerit ligula arcu eu lorem.<br><br>Suspendisse nec nisi euismod magna molestie suscipit ut cursus lorem. Proin suscipit venenatis aliquet. Vivamus pretium, odio vel dignissim cursus, augue nulla tempor urna, sit amet cursus nunc est in leo. Fusce at est tristique, tincidunt nibh ac, venenatis velit. Duis enim orci, bibendum non tristique at, cursus ac lacus. Aliquam consequat augue at enim porta molestie. Integer dignissim tempus turpis. Fusce ut tristique sem. Donec nisl risus, gravida vitae scelerisque ut, placerat auctor lectus. Maecenas tempor tortor rhoncus neque ultrices, pretium congue ex pretium. Sed semper laoreet arcu, at aliquet massa. Nulla ultricies magna leo, et vulputate augue sagittis nec.', '2022-09-28 23:00:10', 3),
	('italy.jpg', 'Italy tour', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sagittis velit elit, eget consectetur dolor imperdiet vitae. Mauris semper neque vitae velit vehicula, ac viverra justo ornare. Proin quis cursus dui, ac pellentesque ante. Nulla sodales malesuada diam, sed dapibus justo lobortis vel. Duis justo lorem, rutrum eget ullamcorper ac, imperdiet pellentesque sapien. Phasellus pretium, quam sit amet mattis blandit, felis urna ultricies erat, vitae ullamcorper felis nisl vel arcu. Donec in consectetur enim.<br><br>Phasellus sit amet rhoncus elit. Integer sem magna, iaculis malesuada mauris in, finibus semper diam. Praesent condimentum massa nec malesuada molestie. Vestibulum eu risus et velit iaculis cursus. Vivamus placerat metus ut eros imperdiet, vitae faucibus metus convallis. Quisque leo dolor, convallis imperdiet aliquet sit amet, varius vitae nibh. Etiam sit amet finibus ante. Quisque dictum purus nec finibus placerat. Cras scelerisque eros at mi hendrerit, vitae interdum velit egestas. Proin tempus sit amet dolor in accumsan.<br><br>Fusce vel sapien sit amet dui pulvinar rhoncus sed a ipsum. In porta tristique nibh, at porttitor ante. Pellentesque et elit finibus, congue felis eget, blandit ex. Integer suscipit molestie justo, in suscipit massa aliquet sollicitudin. Phasellus massa risus, dignissim et convallis eget, iaculis quis lacus. Integer at lectus nisl. Suspendisse quis mauris in mauris gravida consequat. Morbi mattis pretium quam nec bibendum. Proin pharetra magna vel purus iaculis, vitae sodales purus mollis. Etiam nec viverra arcu. Donec placerat ac nisl at dictum. Donec quis porttitor mi, quis vehicula est. Maecenas mollis tempus mattis. Fusce non risus dictum, mattis massa sed, aliquam orci. Nunc a urna vitae ligula finibus dapibus id sit amet augue.<br><br>Morbi tempor semper ante, sed mattis nisl. Aenean cursus sagittis erat. Nunc a semper ipsum. Duis sollicitudin convallis fermentum. In tristique nisi sit amet finibus cursus. Donec quis tellus lobortis, tincidunt tortor posuere, dignissim nibh. Vestibulum non massa eget eros rhoncus dictum eget vitae nisl.<br><br>Ut vitae mauris quis orci euismod convallis in nec est. Nunc at tortor diam. Donec velit tellus, lacinia in malesuada sit amet, iaculis non lectus. Nulla facilisi. Donec rutrum vehicula accumsan. Sed ultrices odio ut lacus rhoncus condimentum. Sed a tincidunt lectus, consectetur tempus neque. Vivamus massa quam, placerat eget tempor accumsan, varius non metus. Nulla facilisi. Ut vitae vehicula risus. Quisque sed maximus magna. Aliquam tempus aliquam faucibus. Sed eget auctor diam. Quisque iaculis, tortor vitae luctus mattis, nisi tortor convallis urna, eget eleifend erat velit eu tellus. Aliquam maximus urna tortor, sed tincidunt sapien ultricies at.<br><br>Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque vel magna nec lectus tempus porta. Sed efficitur dolor id est auctor tristique. Donec at malesuada nulla, mollis tempus turpis. Maecenas ut ligula a enim aliquet rutrum a et nisl. Aliquam sagittis blandit sollicitudin. Proin ultricies arcu orci, in malesuada sem ultricies sed. Nam vitae purus in ex pellentesque imperdiet quis non dui. Phasellus id convallis metus. Pellentesque sit amet nisi ligula. Sed porta porta egestas. Sed congue pellentesque ipsum, vel tincidunt tellus consectetur ut. Praesent facilisis cursus luctus. Suspendisse nec bibendum orci, ac euismod velit. Sed in augue efficitur, pulvinar velit quis, imperdiet turpis. Aliquam egestas urna ac justo sollicitudin blandit.<br><br>Cras metus urna, mollis id neque eu, interdum pulvinar diam. Aenean sollicitudin sapien at augue mollis, vestibulum aliquam ligula vestibulum. Curabitur condimentum libero in mauris accumsan, ut ornare arcu volutpat. Donec dignissim laoreet luctus. Aliquam luctus sapien id tellus consequat sodales. Cras id faucibus lorem. Aliquam gravida urna magna, eget hendrerit nunc cursus vel.<br><br>Fusce ullamcorper sapien id nulla varius, non ultricies mauris vehicula. Cras et egestas lorem, in placerat nisi. Ut sollicitudin eros felis, vitae commodo neque maximus et. Nulla eget velit eu felis volutpat sollicitudin eu a nibh. Fusce massa neque, blandit eget massa placerat, suscipit ullamcorper metus. Morbi porttitor ac erat a imperdiet. Integer in pretium ipsum, et volutpat diam. Sed iaculis, ex in egestas auctor, urna ex dapibus elit, eget pretium eros lorem fermentum turpis.<br><br>Sed lectus dui, imperdiet ut tempor et, scelerisque at nisi. Quisque aliquet ex nec velit rutrum, at facilisis quam accumsan. In tristique risus ac orci luctus eleifend. Mauris in pellentesque sem, eu aliquam urna. Maecenas mattis imperdiet enim, sed malesuada risus ultricies non. Curabitur sapien justo, tincidunt sed orci sit amet, convallis consequat mi. Cras porta sed eros a eleifend. Nunc eget dapibus velit.<br><br>Nulla facilisi. Pellentesque malesuada blandit sapien, vel commodo mi auctor non. Nunc sagittis neque ac enim fermentum, at tincidunt odio aliquet. Aenean porttitor, ligula a finibus varius, lorem ipsum pharetra ex, vel suscipit nulla nisl vel eros. Ut sodales eu orci nec facilisis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque urna eros, luctus non sem at, mattis dignissim augue. Proin ac massa tempor, vestibulum tellus ac, laoreet urna. Nulla dignissim magna at dapibus tincidunt. Mauris eu molestie massa. In leo mauris, euismod quis tortor et, ornare placerat augue. Aenean erat risus, pellentesque ultricies mi eu, viverra efficitur turpis. Sed rutrum mauris lorem, sit amet laoreet arcu dapibus in.', '2022-10-11 12:00:00', 1),
	('land.jpg', 'The beauty of nature', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet vulputate magna. Phasellus vestibulum efficitur sollicitudin. Suspendisse vitae nulla vitae mi scelerisque gravida. Vestibulum rhoncus euismod erat sed volutpat. Etiam vitae commodo tellus. Phasellus id enim imperdiet, feugiat enim nec, dictum neque. Mauris blandit turpis id tellus rutrum congue. Ut tincidunt porttitor vestibulum.<br><br>In commodo pulvinar augue, dictum egestas neque semper a. Morbi egestas pharetra purus, at aliquam enim tincidunt in. Morbi in lacus id nunc luctus tempor. Pellentesque molestie efficitur augue. Pellentesque eu orci imperdiet, consectetur magna vel, suscipit massa. Sed diam quam, facilisis vel turpis ac, pulvinar viverra ante. Mauris vel blandit enim. Aenean bibendum eget velit id sodales. Vestibulum arcu sapien, pellentesque ac egestas tempor, ornare eu ex. Curabitur id mi sit amet libero facilisis consectetur. Integer euismod hendrerit tellus, vitae pellentesque arcu iaculis ut. Curabitur vehicula, orci at pellentesque lacinia, lacus odio volutpat elit, laoreet pretium orci massa eu dui. Integer ornare justo urna, quis scelerisque nibh euismod sit amet. Duis et metus nec diam egestas luctus. Donec blandit tellus sed ex aliquam ornare. Morbi porta egestas lacus, placerat interdum nibh malesuada quis.<br><br>Maecenas pulvinar ac nisi eu suscipit. Nunc aliquam ipsum ligula, nec dapibus libero tempor ut. Aenean et diam ullamcorper, rhoncus est laoreet, dignissim neque. Sed nunc nulla, consectetur at rutrum non, venenatis eget arcu. Nam in pulvinar elit, vitae gravida justo. Suspendisse tempus leo nec interdum condimentum. Aenean blandit est et felis rutrum, ut imperdiet sem euismod. Ut dignissim dolor nec orci pulvinar rhoncus. Nam dapibus a urna vitae laoreet. Sed sem nulla, iaculis id ipsum et, dictum gravida lacus. Suspendisse consectetur auctor euismod. Fusce sollicitudin magna eros, vel fringilla lacus interdum quis. Pellentesque ac imperdiet nulla, a accumsan orci. Proin pellentesque, neque at mattis convallis, risus nunc faucibus dolor, ac tempor odio libero ac nunc. Donec lectus urna, venenatis ac laoreet vitae, blandit et lacus. Pellentesque varius, nunc eget vehicula iaculis, sem quam sollicitudin ligula, sed faucibus diam neque nec dolor.', '2022-10-12 10:10:10', 2),
	('mountain.jpg', 'Tramping through ups and downs','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra sollicitudin libero, tincidunt finibus urna ornare sed. Cras est ex, iaculis in tellus id, feugiat iaculis lectus. Donec id laoreet turpis. Nam sit amet luctus turpis. Nullam sit amet cursus tellus. Vivamus ac neque ornare, scelerisque nunc quis, luctus arcu. Nulla malesuada vulputate enim sit amet commodo. Curabitur sed nisl velit.<br><br>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In elementum condimentum sem, et imperdiet risus vestibulum ac. Nam molestie ornare euismod. Pellentesque eget posuere mi, in cursus justo. Quisque quis laoreet metus. Aliquam libero leo, imperdiet consectetur tincidunt at, malesuada sit amet ex. Sed semper purus commodo tortor ullamcorper cursus. Mauris iaculis justo leo, quis auctor nulla placerat sit amet. Fusce placerat risus tortor, et consequat lectus suscipit et. Sed eu augue eu nunc pharetra fringilla. Quisque quis risus a erat egestas consequat non semper magna. Aliquam erat volutpat. Phasellus posuere dolor at nisl venenatis, ac consequat mauris maximus. Donec ac nisi vel ante sollicitudin feugiat. Suspendisse nisi nisl, ultricies ut felis in, ultricies viverra dolor. Integer id posuere lacus.<br><br>Morbi in malesuada nulla, eu fringilla mi. Mauris viverra quis libero in aliquam. Nullam rhoncus blandit purus ut aliquam. Aenean non erat sit amet magna tempus tincidunt. Pellentesque vitae diam suscipit, euismod dui ut, varius dolor. Mauris eros nibh, tincidunt eu blandit eu, dignissim ac nunc. Duis condimentum neque ac est tempus dapibus. Praesent non fermentum leo, vitae tristique justo.<br><br>Nam iaculis lacus id tortor elementum laoreet. Vivamus volutpat a lacus a porta. Morbi varius pretium ipsum a consequat. Phasellus vehicula pellentesque nisl in feugiat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ac luctus neque. Vivamus blandit odio at ex iaculis euismod eu vitae augue. Donec consequat auctor condimentum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.','2022-10-11 09:09:09',1),
	('town.jpg', 'Places you must visit',  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lacinia, lacus at condimentum interdum, massa massa suscipit urna, vitae efficitur tortor eros non libero. Integer vehicula nibh diam, quis luctus turpis sagittis eu. Aliquam dictum, tellus non accumsan accumsan, enim massa commodo urna, at facilisis lectus sem in urna. Cras scelerisque turpis non risus congue varius. Suspendisse in sapien eu sapien maximus aliquam vitae ut neque. Integer convallis neque eget mauris rutrum varius. Quisque scelerisque tempus ipsum nec porta. Curabitur bibendum in purus et mattis. Pellentesque neque elit, ornare ut consectetur at, ornare ut massa. Etiam tincidunt leo urna, et aliquam diam molestie sed. Aenean elementum erat ut lacus volutpat, in posuere erat laoreet.', '2022-10-11 08:08:08', 3),
	('town2.jpg', 'Day tour at Lorem ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet vulputate magna. Phasellus vestibulum efficitur sollicitudin. Suspendisse vitae nulla vitae mi scelerisque gravida. Vestibulum rhoncus euismod erat sed volutpat. Etiam vitae commodo tellus. Phasellus id enim imperdiet, feugiat enim nec, dictum neque. Mauris blandit turpis id tellus rutrum congue. Ut tincidunt porttitor vestibulum.<br><br>In commodo pulvinar augue, dictum egestas neque semper a. Morbi egestas pharetra purus, at aliquam enim tincidunt in. Morbi in lacus id nunc luctus tempor. Pellentesque molestie efficitur augue. Pellentesque eu orci imperdiet, consectetur magna vel, suscipit massa. Sed diam quam, facilisis vel turpis ac, pulvinar viverra ante. Mauris vel blandit enim. Aenean bibendum eget velit id sodales. Vestibulum arcu sapien, pellentesque ac egestas tempor, ornare eu ex. Curabitur id mi sit amet libero facilisis consectetur. Integer euismod hendrerit tellus, vitae pellentesque arcu iaculis ut. Curabitur vehicula, orci at pellentesque lacinia, lacus odio volutpat elit, laoreet pretium orci massa eu dui. Integer ornare justo urna, quis scelerisque nibh euismod sit amet. Duis et metus nec diam egestas luctus. Donec blandit tellus sed ex aliquam ornare. Morbi porta egestas lacus, placerat interdum nibh malesuada quis.<br><br>Maecenas pulvinar ac nisi eu suscipit. Nunc aliquam ipsum ligula, nec dapibus libero tempor ut. Aenean et diam ullamcorper, rhoncus est laoreet, dignissim neque. Sed nunc nulla, consectetur at rutrum non, venenatis eget arcu. Nam in pulvinar elit, vitae gravida justo. Suspendisse tempus leo nec interdum condimentum. Aenean blandit est et felis rutrum, ut imperdiet sem euismod. Ut dignissim dolor nec orci pulvinar rhoncus. Nam dapibus a urna vitae laoreet. Sed sem nulla, iaculis id ipsum et, dictum gravida lacus. Suspendisse consectetur auctor euismod. Fusce sollicitudin magna eros, vel fringilla lacus interdum quis. Pellentesque ac imperdiet nulla, a accumsan orci. Proin pellentesque, neque at mattis convallis, risus nunc faucibus dolor, ac tempor odio libero ac nunc. Donec lectus urna, venenatis ac laoreet vitae, blandit et lacus. Pellentesque varius, nunc eget vehicula iaculis, sem quam sollicitudin ligula, sed faucibus diam neque nec dolor.', '2022-10-14 10:11:12', 2),
	('tree.jpg', 'Top walkways ', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dictum in ipsum nec accumsan. Etiam condimentum a ligula in vehicula. Etiam vulputate pharetra metus, nec vehicula ex aliquam at. Mauris vitae ante nulla. Sed et lacinia sem. Pellentesque quam mauris, tincidunt ut mi non, rutrum finibus nibh. Maecenas bibendum vehicula imperdiet. Phasellus dolor magna, eleifend vitae vestibulum in, interdum finibus nisl. Nullam id lectus in est porta hendrerit in sed risus. Cras rutrum diam nec faucibus convallis. Mauris consequat, metus at aliquam gravida, tellus velit posuere neque, lobortis feugiat nibh nisi eu justo. Duis sit amet est turpis. Mauris ut convallis augue. Nunc tempus rutrum ante ac tempus.<br><br>Nam fermentum, sapien eleifend ultrices fermentum, leo ante maximus enim, vitae vulputate nisl nisl quis tortor. Nullam urna est, lobortis eu lorem ut, tristique fermentum augue. Fusce semper varius tempor. Quisque aliquam, arcu ut porta tincidunt, felis nisl posuere odio, vitae pulvinar felis nunc eu purus. In hac habitasse platea dictumst. In dignissim in elit sed varius. In et neque nec tortor interdum lacinia. Aenean quam est, sollicitudin quis imperdiet at, sagittis in elit. Aenean tincidunt vel mauris in interdum.', '2022-10-15 05:10:15', 3),
	('waterfront.jpg' ,'Trip to europe','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fringilla, nisl ut molestie convallis, nulla ex pharetra felis, eu auctor nisi risus vestibulum dui. Praesent iaculis arcu sit amet ante fermentum, a suscipit orci aliquam. Vivamus eu enim dignissim mauris elementum fringilla sit amet vitae urna. Nam volutpat nunc eu felis maximus volutpat. Etiam scelerisque sit amet urna sed interdum. Curabitur massa neque, rhoncus dictum mi vel, tincidunt interdum arcu. In nibh purus, dignissim sed molestie a, malesuada at purus. Morbi eu ligula id quam condimentum mollis. <br>Nunc suscipit enim vel laoreet facilisis. Cras placerat odio et leo blandit sollicitudin. Vivamus pharetra, odio quis condimentum vehicula, est nisl vestibulum risus, ac mattis est nunc tristique dolor. Aliquam cursus nulla sit amet congue tristique. Donec cursus, tortor id vestibulum sagittis, diam augue posuere neque, ac pharetra urna mi vel lacus. Etiam ac blandit leo. Nulla iaculis viverra ullamcorper. Donec eget risus consequat, porta odio eu, lacinia dui. Pellentesque varius tempus tellus a blandit. Nullam quis feugiat ligula, vitae pharetra ligula. Praesent blandit porta ex, ac sodales magna blandit et. <br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut nulla scelerisque metus rhoncus semper. Suspendisse sit amet quam sit amet ex sollicitudin dignissim. Sed non volutpat nibh. Morbi a lorem varius, accumsan arcu in, ullamcorper arcu. Nullam semper dictum sapien sit amet efficitur. In varius maximus libero malesuada semper. Phasellus quis velit quis nulla porttitor elementum. Proin non mauris at libero convallis tincidunt sit amet in erat. Nullam nibh eros, pellentesque ut erat sit amet, mattis bibendum turpis. Aenean porttitor at felis sit amet vehicula. Nunc vestibulum pretium scelerisque. Nulla arcu mauris, sagittis a rhoncus at, aliquet ut eros. Donec sit amet sem vehicula elit scelerisque sodales id non dolor. Maecenas non nisl tellus. Integer tincidunt est at odio tempor fringilla.<br>Suspendisse placerat neque nisl, quis mollis massa rhoncus vitae. Donec at turpis odio. Nam tempus vehicula nisl quis vulputate. Curabitur nec risus et ligula aliquet facilisis non nec risus. Ut porta rhoncus posuere. Vestibulum nec nulla dapibus, scelerisque enim quis, auctor velit. Curabitur arcu lectus, pellentesque non pharetra a, congue at tortor. Maecenas hendrerit ex eu mollis ullamcorper. Maecenas euismod dolor quis est tempor vestibulum. Morbi volutpat tortor mi, id tempor eros molestie commodo. Sed nisl sapien, ultricies in blandit sit amet, pretium id sem. Cras lectus leo, ullamcorper sed commodo vel, blandit in libero. Ut ut luctus nisi.<br>Maecenas a urna scelerisque metus mattis viverra in eu orci. Vivamus luctus nulla ut mauris accumsan interdum. Curabitur aliquet sed felis nec cursus. Donec consequat ex sed auctor sodales. Sed posuere facilisis porttitor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec et mi nisl.','2022-10-16 06:12:18', 3),
	('traffic.jpg' , 'A morning in europe', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec libero vel lectus finibus vehicula eget volutpat purus. Mauris ac suscipit ligula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas suscipit sit amet lorem nec bibendum. Curabitur at consectetur est. Duis hendrerit malesuada sem, imperdiet imperdiet lectus tempor in. Ut ut sem ac ex euismod feugiat. Ut magna magna, consectetur ut massa eu, cursus bibendum tortor. Vestibulum nec velit nisl. Donec lobortis faucibus eros, vel porta orci interdum vitae. Vestibulum malesuada, metus vel dapibus varius, ligula lorem aliquam nunc, eu egestas magna ipsum at justo.', '2022-10-17 11:22:33', 4);
	
INSERT INTO subscription VALUES 
	(2, 1, '2022-10-09 01:00:00'),
	(3, 1, '2022-10-01 16:00:00'),
	(4, 3, '2022-10-01 16:00:00'),
	(5, 1, '2022-10-10 01:00:00'),
	(4, 1, '2022-10-11 10:00:00'),
	(4, 2, '2022-10-11 12:00:00'),
	(1, 3, '2022-10-11 04:00:00'),
	(1, 5, '2022-10-12 06:00:00');
	
INSERT INTO comments (content, date_published, parent_comment_id, article_id, commenter_id) VALUES
	('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam est erat, pulvinar eget nibh ac, varius consequat orci. Duis eros.', '2022-10-09 01:00:00', NULL, 1, 2),
	('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consequat justo ac dolor consectetur sollicitudin. Ut vulputate consectetur lectus in aliquet. Cras mollis sit amet felis vitae lacinia. Fusce quis.', '2022-10-10 13:00:00', 1, 1, 1),
	('Lorem ipsum dolor sit amet, consectetur adipiscing.', '2022-10-01 16:00:00', NULL, 1, 3),
	('Lorem ipsum dolor sit.', '2022-10-11 21:00:00', NULL, 2, 5),
	('Lorem ipsum.', '2022-10-12 13:00:00', 4, 2, 2),
	('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt.', '2022-10-13 16:00:00', 5, 2, 1),
	('Lorem ipsum dolor sit amet.', '2022-10-14 01:00:00', NULL, 9, 1),
	('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2022-10-15 13:00:00', NULL, 11, 4),
	('Lorem ipsum dolor sit amet.', '2022-10-13 16:00:00', NULL, 6, 5),
	('Lorem ipsum dolor sit.', '2022-10-15 01:00:00', NULL, 5, 4),
	('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '2022-10-10 14:00:00', NULL, 10, 3),
	('Lorem ipsum dolor sit.', '2022-10-09 16:00:00', NULL, 7, 2);

INSERT INTO liked_articles VALUES
	(1, 2, '2022-10-09 01:00:00'),
	(1, 3, '2022-10-09 02:00:00'),
	(3, 2,'2022-10-04 10:12:00'),
	(2, 1, '2022-10-15 06:00:00'),
	(6, 4, '2022-10-13 04:00:00'),
	(9, 4,'2022-10-13 15:12:00'),
	(11, 5, '2022-10-12 07:00:00'),
	(5, 3,'2022-10-12 14:12:00');
	
INSERT INTO notifications (evoker_id, type, description, date_published, comment_id, article_id, subscribed_to) VALUES 
	(1, 'article', 'posted a new article: Nature and Life', '2022-10-09 00:00:00', NULL, 1, NULL),
	(2, 'article', 'posted a new article: Where am I now?', '2022-10-10 12:12:05', NULL, 2, NULL),
	(3, 'article', 'posted a new article: Exploring nature', '2022-09-28 23:00:10', NULL, 3, NULL),
	(1, 'article', 'posted a new article: Italy tour', '2022-10-11 12:00:00', NULL, 4, NULL),
	(2, 'article', 'posted a new article: The beauty of nature', '2022-10-12 10:10:10', NULL, 5, NULL),
	(1, 'article', 'posted a new article: Tramping through ups and downs', '2022-10-11 09:09:09', NULL, 6, NULL),
	(3, 'article', 'posted a new article: Places you must visit', '2022-10-11 09:09:09', NULL, 7, NULL),
	(2, 'article', 'posted a new article: Day tour at Lorem ipsum', '2022-10-11 08:08:08', NULL, 8, NULL),
	(3, 'article', 'posted a new article: Top walkways', '2022-10-14 10:11:12', NULL, 9, NULL),
	(3, 'article', 'posted a new article: Trip to europe', '2022-10-15 05:10:15', NULL, 10, NULL),
	(4, 'article', 'posted a new article: A morning in europe', '2022-10-17 11:22:33', NULL, 11, NULL),
	(2, 'follow', 'started following you', '2022-10-09 01:00:00', NULL, NULL, 1),
	(3, 'follow', 'started following you', '2022-10-01 16:00:00', NULL, NULL, 1),
	(4, 'follow', 'started following you', '2022-10-01 16:00:00', NULL, NULL, 3),
	(5, 'follow', 'started following you', '2022-10-10 01:00:00', NULL, NULL, 1),
	(4, 'follow', 'started following you', '2022-10-11 10:00:00', NULL, NULL, 1),
	(4, 'follow', 'started following you', '2022-10-11 12:00:00', NULL, NULL, 2),
	(1, 'follow', 'started following you', '2022-10-11 04:00:00', NULL, NULL, 3),
	(1, 'follow', 'started following you', '2022-10-12 06:00:00', NULL, NULL, 5),
	(2, 'comment', 'posted a comment on: Nature and life', '2022-10-10 13:00:00', 1, 1, NULL),
	(1, 'comment', 'posted a comment on: Nature and life', '2022-10-09 01:00:00', 2, 1, NULL),
	(3, 'comment', 'posted a comment on: Nature and life', '2022-10-09 01:00:00', 3, 1, NULL),
	(5, 'comment', 'posted a comment on: Where am I now?', '2022-10-09 01:00:00', 4, 2, NULL),
	(2, 'comment', 'posted a comment on: Where am I now?', '2022-10-09 01:00:00', 5, 2, NULL),
	(1, 'comment', 'posted a comment on : Where am I now?', '2022-10-09 01:00:00', 6, 2, NULL),
	(1, 'comment', 'posted a comment on: Top walkway', '2022-10-09 01:00:00', 7, 9, NULL),
	(4, 'comment', 'posted a comment on: A morning in europe', '2022-10-09 01:00:00', 8, 11, NULL),
	(5, 'comment', 'posted a comment on: Tramping through ups and downs', '2022-10-09 01:00:00', 9, 6, NULL),
	(4, 'comment', 'posted a comment on: The beauty of nature', '2022-10-09 01:00:00', 10, 5, NULL),
	(3, 'comment', 'posted a comment on: Trip to europe', '2022-10-09 01:00:00', 11, 10, NULL),
	(2, 'comment', 'posted a comment on: Places you must visit', '2022-10-09 01:00:00', 12, 7, NULL);

-- inserting article or comment related notifications 
INSERT INTO notify SELECT n.id, s.subscriber_id, s.author_id, NULL 
FROM notifications AS n, subscription AS s WHERE n.evoker_id = s.author_id AND (n.type = 'article' OR type = 'comment');
--inserting follow related notifications 
INSERT INTO notify SELECT n.id, u.id, n.evoker_id, NULL 
FROM notifications AS n, users AS u WHERE n.subscribed_to = u.id AND (n.type = 'follow');

