const express = require("express");
const mogoose = require("mongoose");
const passport = require("passport");

//passport config
require("./config/passport")(passport);



//routes
const auth = require("./routes/auth");

const app = express();

app.get("/", (req, res) => {
    res.send("INDEX");
})

//use routes
app.use('/auth', auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})