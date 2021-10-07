const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

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

function authMiddleware (req, res, next) {
    console.log(req.session.userId)
    User.findById(req.session.userId, (err, user) => {
        if (err || !user) {
            console.log('error')
            return res.redirect('/')
        }
        next()
    })
}


//Get all
router.get('/', async (req, res) => {
    try {
        const reviewArray = await Review.find({}).populate('userid')
        res.render('reviews', {reviewArray: reviewArray, login: req.session.userId})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
});

//Get one
router.get('/:id', getReview, (req, res) => {
    res.json(res.review)
});

//Create one
router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
    console.log(req.session.userId)
    const review = new Review({
        title: req.body.title,
        subtitle: req.body.subtitle,
        text: req.body.text,
        rating: req.body.rating,
        image: req.file.filename,
        userid: req.session.userId
    })
    console.log(req.file, req.body, req.file.filename)
    try {
        const newReview = await review.save();
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
module.exports = router;