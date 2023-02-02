const express = require("express");
const { UserModel } = require("../models/user.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const fs = require("fs");
const tokenList = {};
const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/register", async (req, res) => {
    const { email, pwd, name, age } = req.body

    try {
        bcrypt.hash(pwd, 5, async (err, secure_pwd) => {
            if (err) {
                console.log(err);
            } else {
                const user = new UserModel({ email, pwd: secure_pwd, name, age });
                await user.save()
                res.send("Registered");
            }
        })

    } catch (error) {
        console.log(error);
        res.send("Error in registering");
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, pwd } = req.body
    try {
        const user = await UserModel.findOne({ email })
        let hashed_pwd = user.pwd

        // const user = await UserModel.find({ email: email, pwd: pwd })
        bcrypt.compare(pwd, hashed_pwd, (err, result) => {
            if (result) {
                const token = jwt.sign({ userID: user._id }, process.env.key, { expiresIn: '1h' })
                const refreshToken = jwt.sign({ userID: user._id }, process.env.key, { expiresIn: '7d' })
                const response = {
                    "status": "Logged in",
                    token,
                    refreshToken
                }
                tokenList[refreshToken] = response;
                console.log(tokenList);
                res.status(200).json(response);
            } else {
                res.send("Wrong credentials");
            }
        })
    } catch (error) {
        console.log(error)
        res.send("Error in login in")
    }
})


userRouter.post('/token', async (req, res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": postData.email,
            "name": postData.name
        }
        const data = await UserModel.findOne({ "email":user.email })
        console.log(data);

        const token = jwt.sign({userID: data._id}, process.env.key, { expiresIn: "7d" })
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        console.log(tokenList);
        res.status(200).json(response);
    } else {
        res.status(404).send('Invalid request')
    }
})

userRouter.get("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const b_data = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));
    b_data.push(token);
    fs.writeFileSync("./blacklist.json", JSON.stringify(b_data));
    res.send("Logout successful");
})

module.exports = { userRouter }