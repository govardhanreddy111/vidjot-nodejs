const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverRide = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Map global promise = get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose

const db = require('./config/database');
mongoose.connect(db.mongoURI,{
    useNewUrlParser: true
}).then(()=>{
    console.log("mongodb connected...")
}).catch((err)=>{
    console.log(err)
});

//Handlebars Middleware

app.engine('handlebars',exhbs({
    defaultLayout : 'main'
}));
app.set('view engine','handlebars');
// index Route

//Body parser middleware

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());


//static folder
app.use(express.static(path.join(__dirname, 'public')));


app.use(methodOverRide('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


// Load Routes

const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);


app.get('/', (req,res)=> {
    const title = 'Welcome Govardhan....'
    res.render("index",{
        title : title
    });
});

app.get('/about',(req,res)=>{
    res.render('about');
});

// Use Routes
app.use('/ideas',ideas);
app.use('/users',users);


const port  = process.env.PORT || 4001;
app.listen(port,()=> {
   console.log(`Server started on port ${port}`);
});