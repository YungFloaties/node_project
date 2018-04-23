const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const app = express();

// routes
const courses = require('./routes/courses');
const users = require('./routes/users');

// passport config
require('./config/passport')(passport);

// dbconfig
const db = require('./config/database');


//global promise
mongoose.Promise = global.Promise;
//mongoose connection
mongoose.connect(db.mongoURI)
.then( () => console.log('mongodb connected...'))
.catch(err => console.log(err));





// HB MW
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// BP MW
app.use(bodyParser.urlencoded({ extended: false }))
app.use (bodyParser.json())

// static folders
app.use(express.static(path.join(__dirname, 'public')));


// MO MW
app.use(methodOverride('_method'));

// ES MW
app.use(session({
    secret: 'ishouldnttell',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// g vars
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});





// index get request
app.get('/', (req, res) => {
    const title = 'welcome';
    res.render('index', {
        title: title
    });
});






//use routes
app.use('/courses', courses);
app.use('/users', users);

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Server started on ${port}`);
});