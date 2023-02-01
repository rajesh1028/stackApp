const express = require("express");
const { connection } = require("./configs/db");
const { UserModel } = require("./models/user.model")
const { userRouter } = require("./routes/user.Route")
const { noteRouter } = require("./routes/note.route")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config()
const { authenticate } = require("./middlewares/authenticate.middleware");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Home Page");
})
app.use("/users", userRouter);
app.use(authenticate)
app.use("/notes", noteRouter);


app.get("/about", (req, res) => {
    res.send("About page");
})

app.get("/contacts", (req, res) => {
    res.send("Contacts page");
})



app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
    console.log(`Server is running at ${process.env.port}`);
})
