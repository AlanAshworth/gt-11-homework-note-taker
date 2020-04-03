// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ------------------------------------------------------------------------------
const express = require("express");
const path = require("path");
const fs = require("fs");

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ------------------------------------------------------------------------------
// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static files such as images, CSS files, and JavaScript files
// documentation @ https://expressjs.com/en/starter/static-files.html
// app.use(express.static(path.join(__dirname, "./public/assets/css")));
// app.use(express.static(path.join(__dirname, "./public/assets/js")));
app.use('/css', express.static(path.join(__dirname, './public/assets/css')));
app.use('/js', express.static(path.join(__dirname, './public/assets/js')));

// ==============================================================================
// ROUTES
// Get
// ------------------------------------------------------------------------------
// Basic route that sends the user first to the app root
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Wildcard handler that sends the user first to the app root
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Route that sends the user first to the notes page
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Display all notes
app.get("/api/notes", function(req, res) {
  fs.readFile("./db/db.json", function(err, data) {
    if (err) {
      res.status(500);
      return res.send("An error occurred retrieving notes.");
    }
    const retrievedNotesArray = JSON.parse(data);
    res.json(retrievedNotesArray);
  });
});

// Display note with id
app.get("/api/notes/:id", function(req, res) {
  const noteId = parseInt(req.params.id);
  console.log(noteId);

  if (!noteId) {
    res.status(400);
    return res.send("Select valid id.");
  }

  fs.readFile("./db/db.json", function(err, data) {
    if (err) {
        console.log(err);
      res.status(500);
      return res.send("Error when retrieving note.");
    }
    const notesArray = JSON.parse(data);
    if (noteId >= 0 && noteId < notesArray.length) {
      res.json(notesArray[noteId]);
    } else {
      res.status(404);
      return res.send("Could not find note with id " + notesArray[noteId]);
    }
  });
});

// Post
// ------------------------------------------------------------------------------
// Add new note to file
app.post("/api/notes", function(req, res) {
  console.log(req.body);
  fs.readFile("./db/db.json", function(err, data) {
    if (err) {
      res.status(500);
      return res.send("Error when reading from notes.");
    }
    const notesObject = JSON.parse(data);
    notesObject.push(req.body);
    console.log(notesObject);
    fs.writeFile("./db/db.json", JSON.stringify(notesObject), function(err) {
      if (err) {
        res.status(500);
        return res.send("Error when writing to notes.");
      }
      res.send("Note saved.");
    });
  });
});

// ==============================================================================
// LISTENER
// The below code effectively "starts" our server
// ------------------------------------------------------------------------------
app.listen(PORT, function() {
  console.log("App listening on: http://localhost:" + PORT);
});
