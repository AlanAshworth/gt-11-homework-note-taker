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

// Displays all characters
app.get("/api/notes", function(req, res) {
  return res.json(notes);
});

// Displays a single character, or returns false
app.get("/api/notes/:id", function(req, res) {
  var chosen = req.params.note;

  console.log(chosen);

  for (var i = 0; i < notes.length; i++) {
    if (chosen === notes[i].routeName) {
      return res.json(notes[i]);
    }
  }

  return res.json(false);
});

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
