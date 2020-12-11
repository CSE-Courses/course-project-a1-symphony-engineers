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

const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');  
const moodcheckRoutes = require('./routes/moodcheck');  
const meditationRoutes = require('./routes/meditation');
const musicRoutes = require('./routes/music'); 
const yogaRoutes = require('./routes/yoga'); 
const yogaContentsRoutes = require('./routes/yogaContents'); 
const quizRoutes = require('./routes/quiz');
const warningRoutes = require('./routes/warning');
const resultsRoutes = require('./routes/results');
const quotesRoutes = require('./routes/quotes');
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
app.use('/quotes',quotesRoutes);

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



const sessionId = uuid.v4();
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(function (req, res, next) {


res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
res.setHeader('Access-Control-Allow-Credentials', true);

// Pass to next layer of middleware
next();
});

app.post('/send-msg', (req,res)=>{
  runSample(req.body.MSG).then(data=>{
    res.send({Reply:data})
  })
})

app.get('/chat-bot',(req,res)=>{
res.render('index')
});

/**
* Send a query to the dialogflow agent, and return the query result.
* @param {string} projectId The project to be used
*/
async function runSample(msg,projectId = 'helperbot-9tgk') {


// Create a new session
const sessionClient = new dialogflow.SessionsClient({
    keyFilename:"helperbot-9tgk-9352a90c3d36.json"
});
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// The text query request.
const request = {
  session: sessionPath,
  queryInput: {
    text: {
      // The query to send to the dialogflow agent
      text: msg,
      // The language used by the client (en-US)
      languageCode: 'en-US',
    },
  },
};

// Send request and log result
const responses = await sessionClient.detectIntent(request);
console.log('Detected intent');
const result = responses[0].queryResult;
console.log(`  Query: ${result.queryText}`);
console.log(`  Response: ${result.fulfillmentText}`);
if (result.intent) {
  console.log(`  Intent: ${result.intent.displayName}`);
} else {
  console.log(`  No intent matched.`);
}
return result.fulfillmentText;
}

const chatRoutes = require('./routes/chat');
app.use('/chat',chatRoutes);