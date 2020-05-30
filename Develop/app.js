var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
var port = process.env.PORT || 3000;

var idNumber = 1;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

// routes
app.get("/", function(req, res)
{
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res)
{
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res)
{
    fs.readFile("./db/db.json", function (err, data) 
    {
        if (err) throw err;
        console.log("App.get: read file");
        res.json(JSON.parse(data));
    })
});

//save
app.post("/api/notes", function(req, res)
{
    console.log(req);
    fs.readFile("./db/db.json", function (err, data) 
    {
        if (err) throw err;

        const newNote = 
        {
            id: idNumber,
            title: req.body.title,
            text: req.body.text
        };
        var updatedNotes = JSON.parse(data);
        updatedNotes.push(newNote);
        idNumber++;
        
        fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), function (err, data)
        {
            if (err) throw err;
            console.log("App.post: note saved.");

            res.json(newNote);
        });
    });
});

// delete
app.delete("/api/notes/:id", function(req, res)
{
    console.log(req.params.id);

    fs.readFile("./db/db.json", function (err, data) 
    {
        if (err) throw err;
        console.log("App.delete: read file");

        var updatedNotes1 = JSON.parse(data);

        var updatedNotes2 = updatedNotes1.filter(item => item.id !== parseInt(req.params.id));

        console.log(updatedNotes2);
    
        fs.writeFile("./db/db.json", JSON.stringify(updatedNotes2), function (err)
        {
            if (err) throw err;

            console.log("App.delete: note deleted");

            res.json(updatedNotes2);
        });
    });
});

app.listen(port, function() 
{
    console.log("App listening at: http://localhost:" + port);
});