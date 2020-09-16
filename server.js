// Dependencies
// =============================================================
const express = require('express');
const path = require('path');
const fs = require('fs');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

let notesData = [];

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Routes
// =============================================================

// Should read the `db.json` file and return all saved notes as JSON
app.get('/api/notes', function(err, res) {
  notesData = fs.readFileSync('./db/db.json');
  notesData = JSON.parse(notesData);
  res.json(notesData);
});

// Create New note - takes in JSON input
app.post('/api/notes', function(req, res) {
  notesData = fs.readFileSync('./db/db.json');
  notesData = JSON.parse(notesData);
  req.body.id = notesData.length;
  notesData.push(req.body);
  notesData = JSON.stringify(notesData);
  fs.writeFileSync('./db/db.json', notesData);
  res.json(req.body);
});

// Should receive a query parameter containing the id of a note to delete.
app.delete('/api/notes/:id', function(req, res) {
  notesData = fs.readFileSync('./db/db.json');
  notesData = JSON.parse(notesData);
  notesData = notesData.filter(function(note) {
    return note.id != req.params.id;
  });
  notesData = JSON.stringify(notesData);
  fs.writeFileSync('./db/db.json', notesData);
  res.send(req.body);
});

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', function(req, res) {
  return res.sendFile(path.json(__dirname, '/db/db.json'));
});

// GET `/notes` - Should return the `notes.html` file.
app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET `*` - Should return the `index.html` file
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, function() {
  console.log('SERVER IS LISTENING: ' + PORT);
});
