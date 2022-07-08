const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("new request", req.method, req.url);
  next();
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readFile("models/guest.json", (err, data) => {
    if (err) throw err;
    const guests = JSON.parse(data);
    console.log(guests);
    res.render("home", { guests });
  });
});

app.post(
  "/message",

  body("firstName").isLength({ min: 1, max: 70 }),
  body("lastName").isLength({ min: 1, max: 70 }),
  body("email").isEmail(),
  body("message").isLength({ min: 1, max: 500 }),
  (req, res) => {
    const newGuest = req.body;
    console.log(newGuest);

    const errors = validationResult(req);
    console.log("validation errors:", errors);
    if (!errors.isEmpty()) {
      return res.status(400).render("invalid-input", { errors: errors.errors });
    }
    fs.readFile("models/guest.json", (err, data) => {
      const guests = JSON.parse(data);
      guests.push(newGuest);
      console.log(guests);
      fs.writeFile(
        "models/guest.json",
        JSON.stringify(guests, null, 4),
        (err) => {
          if (err) throw err;
        }
      );
    });

    res.redirect("/");
  }
);

module.exports = app;
