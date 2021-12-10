const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const fs = require('fs')

const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: 'public/images/',
    filename: function (req, file, cb) {
      const prefix = Math.round(Math.random() * 1E6)
      cb(null, prefix + file.originalname)
    }
  })
const upload = multer({ storage: storage })

//Get all
router.get('/', async (req, res) => {
    try {
        const reviewArray = await Review.find({}).populate('userid')
        res.render('reviews', {reviewArray: reviewArray, login: req.session.userName})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
});

//search
router.get('/search/:query', async (req, res) => {
    //const query = req.params.query;
    const query = new RegExp(req.params.query, 'i') 
    try {
        const reviewArray = await Review.find( {$or: [{ title: query},
                                                     { subtitle: query},
                                                     { text: query}]}).populate('userid')
        res.render('reviews', {reviewArray: reviewArray, login: req.session.userName})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
});

router.get('/new', (req, res) => {
    res.render('createPost', {login: req.session.userName})
});

//Create one
router.post('/create', authMiddleware, upload.single('file'), async (req, res) => {
    console.log(req.body, req.file);
    let review = new Review({
        title: req.body.title,
        subtitle: req.body.subtitle,
        text: req.body.text,
        ratings: getRatingsArray(req.body),
        image:[{name: req.file.filename,
                contentType: req.file.mimetype,
                data: fs.readFileSync(path.join(__dirname + '/../public/images/' + req.file.filename))
        }],
        userid: req.session.userId
    })
    
    try {
        const newReview = await review.save();
        fs.unlink(path.join(__dirname + '/../public/images/' + req.file.filename),function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
       });  
        res.redirect('/reviews')
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

//Update one
router.patch('/:id', getReview, async (req, res) => {
    let keys = Object.keys(req.body);
    keys.forEach( (key) => {
        res.review[key] = req.body[key]
    })
    try {
        const updatedReview = await res.review.save()
        res.json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});

//Delete one
router.delete('/:id', getReview, async (req, res) => {
    try {
        let title = res.review.title;
        await res.review.remove();
        res.json({ message: "Deleted review " + title});
    } catch (err) {
        res.status(500).json({ message: err.message});
    }

});

//Get one
router.get('/:id', getReview, (req, res) => {
    res.json(res.review)
});

async function getReview(req, res, next) {
    let review;
    try {
        review = await Review.findById(req.params.id);
        if (review == null) {
            return res.status(404).json({message: "cannot find"});
        }
    } catch (err){
        return res.status(500).json({message: "YO" + err.message});
    }
    res.review = review;
    next();
}

async function getReview(req, res, next) {
    let review;
    try {
        review = await Review.findById(req.params.id);
        if (review == null) {
            return res.status(404).json({message: "cannot find"});
        }
    } catch (err){
        return res.status(500).json({message: "YO" + err.message});
    }
    res.review = review;
    next();
}

function authMiddleware (req, res, next) {
    console.log(req.session.userId)
    User.findById(req.session.userId, (err, user) => {
        if (err || !user) {
            console.log('error')
           // return res.redirect('/')
        }
        next()
    })
}

function getRatingsArray(body) {
    let keys = Object.keys(body)
    let iconKeys = keys.filter( key => key.slice(0, -1) === 'icon')
    let ratingKeys = keys.filter( key => key.slice(0, -1) === 'rating')
    let result = []
    for (let i = 0; i < iconKeys.length; i++) {
        result.push({ icon: body[iconKeys[i]], rating: body[ratingKeys[i]] })
    }
    return result
}


module.exports = router;