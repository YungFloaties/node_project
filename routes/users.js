const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();


// USER model
require('../models/User');
const User = mongoose.model('users');


// user login 
router.get('/login', (req, res) => {
    res.render('users/login');
});

// user registration 
router.get('/register', (req, res) => {
    res.render('users/register');
});

// login form

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/courses',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Register Form POST
router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.passwordC){
        errors.push({text: 'passwords entered do not match'});
    }

    if(req.body.password.length < 5){
        errors.push({text: 'password must be at least 5 characters'});
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordC: req.body.passwordC
        });
    } else {
        User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    req.flash('error_msg', 'email already in db');
                    res.redirect('/users/register')
                } else {
                    const newUser = new User ({
                        name:req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
            
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'registration successful');
                                res.redirect('/users/login');
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            });
                        });
                        
                    });
                }
            });
           
               
       

    }

});


// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'you have logged out');
    res.redirect('/users/login');
})




module.exports = router;

