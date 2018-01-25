const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/images");
const config = require('./config.json')



exports.getImages = () => {
    return db.query (`SELECT image, title, id
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

exports.chooseSelectedImage = (id) => {
        return db.query (`SELECT image, title, description
                         FROM images
                         WHERE id = $1`, [id])
        .then((results) => {
            console.log('results:', results);
            results.rows[0].image = config.s3Url + results.rows[0].image
            return results.rows[0];
        })
}
