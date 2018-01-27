DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(300) NOT NULL,  --the name uidSafe gives our image (also part of its url)
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    commentid SERIAL PRIMARY KEY,
    comment VARCHAR(300) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    imageid VARCHAR (3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
