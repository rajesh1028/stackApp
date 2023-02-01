const jwt = require("jsonwebtoken");
require("dotenv").config()
const fs = require("fs");

const authenticate = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];
    //console.log(token);
    if (!token) {
        res.send("Login again");
    }
    const b_data = JSON.parse(fs.readFileSync("./blacklist.json"))

    if (b_data.includes(token)) {
        res.send("session expired login again to continue");
    } else {
        jwt.verify(token, process.env.key, (err, decoded) => {
            if (err) {
                res.send("Please login again");
            } else {
                const userID = decoded.userID;
                req.body.userID = userID;
                next();
            }
        })
    }





    // const token = req.headers.authorization
    // if (token) {
    //     const decoded = jwt.verify(token, process.env.key)
    //     if (decoded) {
    //         const userID = decoded.userID;
    //         req.body.userID = userID;
    //         next();
    //     } else {
    //         res.send("Please login first");
    //     }
    // } else {
    //     res.send("Please login first");
    // }
}

module.exports = { authenticate }