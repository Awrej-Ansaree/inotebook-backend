const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

// Route 1: Get all notes of the user using: GET "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    user = req.user.id;
    // Getting all the notes of the specified user
    const notes = await Notes.find({ user });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: Add new notes of the user using: POST "/api/notes/addnote". Login Required
router.post(
  "/addnote",
  [
    body("title", "Enter a vaild title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    // Finds the validation errors in this request and returns a bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Adding the note of the specified user
      const notes = await Notes.create({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      });
      res.json(notes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Update an existing note of the user using: PUT "/api/notes/updatenote". Login Required
router.put(
  "/updatenote/:id",
  [
    body("title", "Enter a vaild title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    // Finds the validation errors in this request and returns a bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;

      // New Note of the user
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      // Find the note to be updated
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }

      // Check whether the note belongs to the Logined In user or not
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Access Denied");
      }

      // Updating the note
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 4: Deleting an existing note of the user using: DELETE "/api/notes/deletenote". Login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Check whether the note belongs to the Logined In user or not
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied");
    }

    // Delete the note if it belongs to the user
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Your note has been deleted successfully", note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
