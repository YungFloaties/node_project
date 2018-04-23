if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://brock:brock@ds115758.mlab.com:15758/courses_deployed'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/coursemanager'}
}