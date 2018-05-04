const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//load user model
require("./model/user");

//passport config
require("./config/passport")(passport);


//routes
const auth = require("./routes/auth");
const index = require("./routes/index");

//load keys
const keys = require("./config/keys");

//mongoose connect
mongoose.connect(keys.mongoURI, (err) => {
    if(err) throw err;
    console.log("MongoDb connected")
});

const app = express();

//middleware handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

//cookie parser
app.use(cookieParser())

//express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//globals
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next();
})

//use routes
app.use('/', index);
app.use('/auth', auth);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})