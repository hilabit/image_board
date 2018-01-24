const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/images");
const config = require('./config.json')



exports.getImages = () => {
    return db.query (`SELECT image, title
                        FROM images
                        LIMIT 8`)
    .then((results) => {
        console.log("getImage results", results);
        for( var i = 0; i<results.rows.length; i++) {
            results.rows[i].image =  config.s3Url + results.rows[i].image;
        }
        return results.rows;
    })
}

exports.addImageToDataBase = (image, {username, title, description}) => {
                    return db.query
                     (`INSERT INTO images (image, username, title, description)
                                  VALUES ($1, $2, $3, $4)`,[image,username,title,description])

}

exports.chooseSelectedImage = (image, {title, description}) => {
        return db.query (`SELECT image, title, description
                         FROM images
                         WHERE id = $1`, [image, title, description])
        .then((results) => {
            console.log('results:', results);
            return results.rows[0];
        })
}
