DROP TABLE IF EXISTS entries, listings, users;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username varchar(32) NOT NULL, -- TODO: move from plain text to hash
    password varchar(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
    listing_id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    listing_name varchar(64) NOT NULL,
    insertion_date timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS entries (
    entry_id SERIAL PRIMARY KEY,
    listing_id integer NOT NULL REFERENCES listings ON DELETE CASCADE ON UPDATE CASCADE,
    entry_date varchar(32) NOT NULL, -- does not need to be a real date type
    name varchar(32) NULL,
    fc char(16) NOT NULL,
    code varchar(8) NOT NULL,
    phone varchar(16) NOT NULL,
    scanned bit NOT NULL DEFAULT 0::bit
);

INSERT INTO users (username, password) VALUES ('user1', 'user1');
INSERT INTO users (username, password) VALUES ('user2', 'user2');