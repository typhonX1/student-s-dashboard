const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registration endpoint
app.post("/register", (req, res) => {
  const studentData = req.body;

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
        res.status(500).json({ success: false, error: "Failed to save student data." });
      } else {
        res.status(200).json({ success: true, message: "Student registered successfully." });
      }
    });
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile("students.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    let students = [];
    try {
      students = JSON.parse(data);
    } catch (e) {
      console.error("JSON parse error:", e);
      return res.status(500).json({ success: false, message: "Invalid student data" });
    }

    // Normalize key names to handle "Username" vs "username"
    const user = students.find((student) => {
      const sUsername = student.username || student.Username || "";
      const sEmail = student.email || "";
      const sPassword = student.password || "";

      return (
        (sUsername === username || sEmail === username) &&
        sPassword === password
      );
    });

    if (user) {
      res.status(200).json({ success: true, student: user });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
