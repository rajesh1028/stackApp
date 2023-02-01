const express = require("express");
const { NoteModel } = require("../models/note.model")

const noteRouter = express.Router();

noteRouter.get("/", async (req, res) => {
    try {
        const data = await NoteModel.find()
        if (data) {
            res.send(data);
        } else {
            res.send({ "msg": "Something went wrong" })
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

noteRouter.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        const new_note = new NoteModel(payload);
        await new_note.save();
        res.send("Created the note");
    } catch (error) {
        console.log(error);
        res.send({ "msg": "Something went wrong" });
    }
})

noteRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body;
    const id = req.params.id;
    const note = await NoteModel.findOne({ "_id": id });
    const userID_note = note.UserID;
    const userID_req = req.body.UserID;

    try {
        if (userID_note != userID_req) {
            res.send({ "msg": "You are not authorized" });
        } else {
            await NoteModel.findByIdAndUpdate({ "_id": id }, payload)
            res.send("Updated the note");
        }
    } catch (error) {
        console.log(error)
        res.send({ "msg": "Something went wrong" })
    }
})

noteRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const note = await NoteModel.findOne({ "_id": id });
    const userID_note = note.UserID;
    const userID_req = req.body.UserID;

    try {
        if (userID_note != userID_req) {
            res.send({ "msg": "You are not authorized" });
        } else {
            await NoteModel.findByIdAndDelete({ "_id": id })
            res.send("Deleted the note");
        }
    } catch (error) {
        console.log(error)
        res.send({ "msg": "Something went wrong" })
    }
})


module.exports = { noteRouter }