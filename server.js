const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registration endpoint
app.post("/register", (req, res) => {
  const studentData = req.body;

  // Read existing data
  fs.readFile("students.json", "utf8", (err, data) => {
    let students = [];

    if (!err && data) {
      try {
        students = JSON.parse(data);
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    students.push(studentData);

    fs.writeFile("students.json", JSON.stringify(students, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
        res.status(500).send("Failed to save student data.");
      } else {
        res.status(200).send("Student registered successfully.");
      }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
