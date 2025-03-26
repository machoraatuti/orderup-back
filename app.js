var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//imports
require("dotenv").config();
const connectDb = require("./config/mongo");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//custom routers
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRoutes");

var app = express();

//connect to mongoDb
connectDb();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//add custom routers 
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
