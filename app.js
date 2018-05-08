const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//load user model
require("./model/user");
require("./model/story");

//passport config
require("./config/passport")(passport);


//routes
const auth = require("./routes/auth");
const index = require("./routes/index");
const stories = require("./routes/stories");

//load keys
const keys = require("./config/keys");

//handlebars helper
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require("./helpers/hbs");

//mongoose connect
mongoose.connect(keys.mongoURI, (err) => {
    if(err) throw err;
    console.log("MongoDb connected")
});

const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//method override middleware
app.use(methodOverride('_method'));

//middleware handlebars
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate:  formatDate,
        select: select,
        editIcon: editIcon
    },
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

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//use routes
app.use('/', index);
app.use('/auth', auth);
app.use("/stories", stories)


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})