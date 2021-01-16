const express   = require("express");
const path      = require("path");
const fs        = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    // display home HTML
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    // display notes HTML
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {

    const str = fs.readFileSync(path.join(__dirname, "./db/db.json"), function(err, data) {
                    if (err) throw err;
                    console.log(data);
                });

    return res.json(JSON.parse(str));
});

app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    console.log(newNote);
    return res.json(newNote);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});