CREATE USER 'auth_dbuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

CREATE database AUTH;

create TABLE AUTH.users (
	userid int NOT NULL AUTO_INCREMENT,
	username varchar(250) not null unique,
    user_password varchar(250),
    PRIMARY KEY (userid)
);

create TABLE AUTH.access_tokens (
	userid int NOT NULL,
	access_token varchar(250) not null unique
);

GRANT ALL PRIVILEGES ON AUTH.access_tokens TO 'auth_dbuser'@'localhost';
GRANT ALL PRIVILEGES ON AUTH.users TO 'auth_dbuser'@'localhost';
FLUSH PRIVILEGES;