const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// Create a User using: POST "/api/auth/createuser". No Login Required
router.post(
  "/createuser",
  [
    body("name", "Enter a vaild name").isLength({ min: 3 }),
    body("email", "Enter a vaild email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and returns a bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether a user with same email already exists or not
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, A user with this email already exists." });
      }

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some thing went wrong!")
    }
  }
);

module.exports = router;
