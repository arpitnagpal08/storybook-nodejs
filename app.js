const express = require("express");
const mogoose = require("mongoose");

const app = express();


app.get("/", (req, res) => {
    res.send("INDEX");
})



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})