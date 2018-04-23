const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema ({
    coursename:{
        type: String,
        required: true
    },
    instructor:{
        type: String,
        required: true
    },
    semester:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    }
});

mongoose.model('courses', CourseSchema);