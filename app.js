if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const session = require('express-session');
const Local = require('passport-local');
const flash = require('connect-flash');
const User = require('./models/user');

const userRoutes = require('./routes/users');  
const moodcheckRoutes = require('./routes/moodcheck');  
const meditationRoutes = require('./routes/meditation');
const musicRoutes = require('./routes/music'); 
const yogaRoutes = require('./routes/yoga'); 
const yogaContentsRoutes = require('./routes/yogaContents'); 
const quizRoutes = require('./routes/quiz');
const warningRoutes = require('./routes/warning');
const resultsRoutes = require('./routes/results');
const { MongoStore } = require('connect-mongo');

const MongoDBStore = require("connect-mongo")(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/serenity';

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();
app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))

const secret = process.env.SECRET || 'secret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60
})

store.on("error", function(e){
    console.log("Session Store Error",e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig))
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new Local(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/moodcheck',moodcheckRoutes);
app.use('/meditation',meditationRoutes);
app.use('/music',musicRoutes);
app.use('/yoga',yogaRoutes);
app.use('/yogaContents',yogaContentsRoutes);
app.use('/quiz',quizRoutes);
app.use('/warning',warningRoutes);
app.use('/results',resultsRoutes);



app.get('/',(req,res)=>{
    res.render('home')
});


app.get('/warning',(req,res)=>{
    res.render('warning')
});

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Serving on port ${port}`)
});
