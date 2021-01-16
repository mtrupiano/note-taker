const express   = require("express");
const path      = require("path");
const fs        = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static content, style, and logic
app.use(express.static(__dirname + "/public"));

let idCounter = 1;

// Display the home page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Display the 'Notes' page
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Read saved notes
app.get("/api/notes", function (req, res) {

    const str = fs.readFileSync(path.join(__dirname, "./db/db.json"), function(err, data) {
                    if (err) throw err;
                    console.log(data);
                });

    return res.json(JSON.parse(str));
});

// Save a new note to the ''database''
app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    newNote.id = idCounter;
    idCounter++;
    console.log(newNote);
    let dbJsonPath = path.join(__dirname, "db", "db.json");
    const notes = JSON.parse(fs.readFileSync(dbJsonPath, function(err, data) {
                                if (err) throw err;
                             }));

    notes.push(newNote);

    fs.writeFile(dbJsonPath, JSON.stringify(notes), function(err) {
        if (err) throw err;
    });

    return res.json(newNote);
});

// Port listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});