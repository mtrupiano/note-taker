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
const dbPath = path.join(__dirname, "db", "db.json");

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

    const str = fs.readFileSync(dbPath, function(err, data) {
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
    const notes = JSON.parse(fs.readFileSync(dbPath, function(err, data) {
                                if (err) throw err;
                             }));

    notes.push(newNote);

    fs.writeFile(dbJsonPath, JSON.stringify(notes), function(err) {
        if (err) throw err;
    });

    return res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {

    const arr = JSON.parse (
                    fs.readFileSync(dbPath, function (err, data) {
                                    if (err) throw err;
                    })
                );

    const toDelete = arr.findIndex(e => e.id == req.params.id );
    arr.splice(toDelete, 1);
    
    fs.writeFileSync(dbPath, JSON.stringify(arr), function(err) {
        if (err) throw err;
    });

    return true;

});

// Port listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});