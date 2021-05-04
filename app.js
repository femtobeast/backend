require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require('express-session')
const FileStore = require('session-file-store')(expressSession)
const cors = require('cors')
var indexRouter = require('./routes/index');
var authRouter = require('./routes/verification');
var contentRouter = require('./routes/content');
//database config modules
const setUpDatabase = require('./db_configuration/mongoDB')
//init mongodb connection
setUpDatabase()
//init express app
var app = express();

const HOURS = 1000 * 60 * 60 * 24;
const {
  SESS_NAME = 'fbid',
  SESS_SECRET = 'JHGF>,./?;;LJ8#$?,KL:>>>,,KJJJDHE',
  NODE_ENV = 'development',
  SESS_LIFETIME = HOURS
} = process.env

//Cross Origin
const corsOption = {
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3000",
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['*']
};
app.use(cors(corsOption));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//SESSION DEFINE
app.use(expressSession({
  name: SESS_NAME,
  resave: false,
  secret: SESS_SECRET,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: SESS_LIFETIME,
    sameSite: false,
  },
  store: new FileStore({
    logFn: function () { },
  }),
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Route Defination
app.use('/', indexRouter);
app.use('/api/auth', authRouter);                //Route for login,registration,authentication
app.use('/api/content',contentRouter);





app.use((req, res, next) => {
  res.locals.session = req.session;
  const {_id,  email, token,type } = res.locals.session;
  if (token) {
    res.locals.email = email;
    res.locals.type = type;
    res.locals._id = _id;
  }
  next();
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.send({ "status": err.status, "message": err.message, "success": false, "error":err.error });
  // res.render('error');
});

module.exports = app;
