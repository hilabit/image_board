//just express stuff
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('spiced-pg');
const queries = require('./queries.js');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const getImages = queries.getImages;
const chooseSelectedImage = queries.chooseSelectedImage;
const knox = require('knox');
const fs = require('fs');
const addImageToDataBase = queries.addImageToDataBase;
const addCommentToDatabase = queries.addCommentToDatabase;
const showComment = queries.showComment;
let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'imageboardwork'
});

app.use(express.static(`public`));
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json());






var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

function uploadToS3 (req,res,next) {
    console.log("req.file:", req.file);
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });
    //Check if a the put was successful
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);
    //The req obj will emit event when finished, handle the event and check
    //the status of the res to determine if the put was successful.
    //If put was successful, acess it in https://s3.amazonaws.com/:Bucket/:filename
    //bucket name: spicedling
    s3Request.on('response', s3Response => {
        const wasSuccessful = s3Response.statusCode == 200;
        console.log("s3response:", s3Response.statusCode);
        if(wasSuccessful) {
            next();
        } else {
            res.sendStatus(500); //sends response without a body, but with  a status code to tell us where we're at
        }
    });
}

app.get('/images', (req,res) => {
    console.log("in get request");
    getImages().then((results) => {
        console.log("got images", results);
        res.json({images:results})
    }).catch((err) => {
        console.log("err in get server", err);
    })
})

app.post('/upload-image', uploader.single('file'), uploadToS3, (req, res) => {
    // If nothing went wrong the file is already in the uploads directory
    console.log("in uploads post");
    if (req.file) {
        addImageToDataBase(req.file.filename, req.body);

        res.json({
            success: true,
            image: config.s3Url + req.file.filename,
            title: req.body.title,
            description: req.body.description,
            username: req.body.username
        })
    } else {
        res.json({
            success: false
        })
    }
});

app.get('/bigImage/:selectedImageId', (req,res) => {
    return Promise.all ([
        chooseSelectedImage(req.params.selectedImageId),
        showComment(req.params.selectedImageId)
        // console.log("req.params.selectedImageId",req.params.selectedImageId);
    ])
    .then(function([imageResults,commentResults]) { //this is the array of the paromise all results
        console.log("comments results:", commentResults);
        res.json({
            id: req.params.selectedImageId,
            image: imageResults,
            comments: commentResults
        }).catch((err) => {
            console.log("error in get big image request", err);
        })
    })
})

app.post('/inputField', function(req,res) {
    console.log("insertComment req.body", req.body);
    const {comment, username, imageid} = req.body;
    console.log("comment:", comment);
    addCommentToDatabase(comment, username, imageid).then((results) => {
        console.log("results for addCommentToDatabase", results); //commentid, created_at
        res.json({
            comment: comment,
            username: username,
            imageid: imageid,
            created_at: results.created_at,
            commentid: results.commentid
            })
    .catch((err) => {
        console.log("error in insertComment", err);
    })
})
});










//get for query to get one image and enlarge it + add comments through the component.

app.listen(8080, () => console.log("I'm listening"));
