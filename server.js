const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()

const port = process.env.PORT ||4000;

const app = express();

//database connection
mongoose.connect(process.env.DATABASE,{useNewUrlParser: true, useUnifiedTopology: true, }, (err) => {
      if (err) {
          throw err;
      } else {
          console.log('Database Connected');
      }
    }
  );

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
    session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true,
      cookie : {
        maxAge : 4 * 60 * 60 * 1000
      }
    })
  );
app.use(cookieParser(process.env.SECRET));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use(require('./routes/main/User'))

app.listen(port, () => {
    console.log("Listening to port: " + port);
})