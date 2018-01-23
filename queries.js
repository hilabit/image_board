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
