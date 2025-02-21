const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const bodyParser = require("body-parser")


const app = express();
app.use(cors());
app.use(bodyParser.json())


//mysql connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "support_ticket_system"
});

db.connect((err) => {
    if (err) throw err;
    console.log("connecte to Mysql")

});

//api routes

//create a ticket
app.post("/tickets", (req, res) => {
    const { subject, description } = req.body;
    const sql = "INSERT INTO tickets (subject, description) VALUES (?, ?)";
    db.query(sql, [subject, description], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ message: "Ticket created", id: result.insertId });
    });
  });

  app.get("/tickets", (req, res) => {
    db.query("SELECT * FROM tickets", (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });
  
// fetch single ticket by id
app.get("/tickets/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM tickets WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).json({ message: "Ticket not found" });
    res.json(result[0]);
  });
});
// Update ticket status and details
app.put("/tickets/:id", (req, res) => {
    const { id } = req.params;
    const { subject, description, status } = req.body;
    const sql = "UPDATE tickets SET subject = ?, description = ?, status = ? WHERE id = ?";
    db.query(sql, [subject, description, status, id], (err) => {
      if (err) return res.status(500).json({ message: "Failed to update ticket", error: err });
      res.json({ message: "Ticket updated successfully" });
    });
  });
  

// Delete a ticket
app.delete("/tickets/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM tickets WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Ticket deleted" });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
