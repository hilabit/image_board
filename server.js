//just express stuff


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('spiced-pg');
const queries = require('./queries.js');
const getImages = queries.getImages;
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json());

app.listen(8080, () => console.log("I'm listening"));


app.get('/images', (req,res) => {
    console.log("in get request");
    getImages().then((results) => {
        console.log("got images", results);
        res.json({images:results})
    }).catch((err) => {
        console.log("err in get server", err);
    })
})
