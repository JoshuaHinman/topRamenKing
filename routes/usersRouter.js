const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt')

router.post('/signup', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    })
    console.log(user)
    try {
      const newUser = await user.save();
      res.redirect('/reviews')
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
});

//Get one
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.findOne({username: username}, (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if(same) {
                    console.log("login successful")
                    req.session.userId = user._id;
                    req.session.userName = user.username;
                    req.session.userSignup = user.signupDate;
                    res.redirect('/reviews')
                } else {
                    console.log("declined: wrong password")
                    res.redirect('/reviews')
                }
            })
        } else {
            console.log("declined: no username match")
             res.redirect('/reviews')
        }
    } )
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
});

module.exports = router;