const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;
const STUDENT_FILE = "students.json";

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gmail transporter using App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "asdfgarapatiabhishek@gmail.com", // your Gmail
    pass: "hbut jaac qtop lryy"          // replace with 16-character app password
  }
});

// Register endpoint
app.post("/register", (req, res) => {
  const studentData = req.body;

  fs.readFile(STUDENT_FILE, "utf8", (err, data) => {
    let students = [];

    if (!err && data) {
      try {
        students = JSON.parse(data);
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    students.push(studentData);

    fs.writeFile(STUDENT_FILE, JSON.stringify(students, null, 2), (err) => {
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

  fs.readFile(STUDENT_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });

    let students = [];
    try {
      students = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ success: false, message: "Corrupted data" });
    }

    const user = students.find((student) => {
      const sUsername = student.username || student.Username || "";
      const sEmail = student.email || "";
      const sPassword = student.password || "";

      return (sUsername === username || sEmail === username) && sPassword === password;
    });

    if (user) {
      res.status(200).json({ success: true, student: user });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  });
});

// Forgot Password Endpoint
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  fs.readFile(STUDENT_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });

    let students = [];
    try {
      students = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ success: false, message: "Data read error" });
    }

    const student = students.find((s) => s.email === email);

    if (!student) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const resetLink = `http://localhost:${PORT}/reset-password.html?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: '"Sphoorthy College" <asdfgarapatiabhishek@gmail.com>',
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${student.name || "Student"},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn’t request this, you can ignore this email.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res.status(500).json({ success: false, message: "Failed to send email" });
      }

      console.log("Email sent:", info.response);
      res.status(200).json({ success: true, message: "Reset link sent to your email" });
    });
  });
});

// Reset Password Endpoint
app.post("/reset-password", (req, res) => {
  const { email, newPassword } = req.body;

  fs.readFile(STUDENT_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });

    let students = [];
    try {
      students = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ success: false, message: "Corrupted data" });
    }

    const studentIndex = students.findIndex((s) => s.email === email);
    if (studentIndex === -1) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    students[studentIndex].password = newPassword;

    fs.writeFile(STUDENT_FILE, JSON.stringify(students, null, 2), (err) => {
      if (err) {
        console.error("Write error:", err);
        return res.status(500).json({ success: false, message: "Failed to update password" });
      }

      res.status(200).json({ success: true, message: "Password updated successfully" });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
