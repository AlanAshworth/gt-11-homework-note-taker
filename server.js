// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

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

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
