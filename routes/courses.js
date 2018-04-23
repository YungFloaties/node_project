const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');


// include Course schema
require('../models/Course');
const Course = mongoose.model('courses');


router.get('/', ensureAuthenticated, (req, res) => {
    Course.find({user: req.user.id})
        .then(courses => {
            res.render('courses/index', {
                courses:courses
            });
        })
    
});


// add page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('courses/add');
});
// edit page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Course.findOne({
        _id: req.params.id
    })
    .then(course => {
        if(course.user != req.user.id){
            req.flash('error_msg', 'not authorized');
            res.redirect('/courses');
        } else {
        res.render('courses/edit', {
            course:course
        });
    }
    });
});



// handle form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if(!req.body.coursename){
        errors.push({text:'add a course name'});
    }
    if(!req.body.instructor){
        errors.push({text:"add an instructor"});
    }
    if(!req.body.semester){
        errors.push({text:"add a semester"});
    }
    if(errors.length > 0){
        res.render('courses/add', {
            errors: errors,
            coursename: req.body.coursename,
            instructor: req.body.instructor,
            semester: req.body.semester
        });
    } else {
        const newUser = {
            coursename: req.body.coursename,
            instructor: req.body.instructor,
            semester: req.body.semester,
            user: req.user.id
        }
        new Course(newUser)
            .save()
            .then(course => {
                req.flash('success_msg', 'course added');
                res.redirect('/courses');
            })
    }
});


//Edit a course
router.put('/:id', ensureAuthenticated, (req, res) => {
    Course.findOne({
        _id: req.params.id
    })
    .then(course => {
        course.coursename = req.body.coursename;
        course.instructor = req.body.instructor;
        course.semester = req.body.semester;

        course.save()
            .then(course => {
                req.flash('success_msg', 'course information updated');
                res.redirect('/courses');
            })
    });
});

// Delete a course
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Course.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Course Deleted');
            res.redirect('/courses');
        });
});



module.exports = router; 
