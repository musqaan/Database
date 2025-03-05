const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "flipkart_clone",
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// GET All Products
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

// GET a Single Product by ID
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result[0]);
  });
});

// POST Add a New Product (including des)
app.post("/api/products", (req, res) => {
  const { name, price, rating, category, image, des } = req.body;

  if (!name || !price || !rating || !category || !image) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "INSERT INTO products (name, price, rating, category, image, des) VALUES (?, ?, ?, ?, ?, ?)",
    [name, price, rating, category, image, des || null],
    (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Product added!", id: result.insertId });
    }
  );
});

// PUT Update a Product (including des)
app.put("/api/products/:id", (req, res) => {
  const { name, price, rating, category, image, des } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE products SET name=?, price=?, rating=?, category=?, image=?, des=? WHERE id=?",
    [name, price, rating, category, image, des, id],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Product updated!" });
    }
  );
});

// DELETE a Product
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Product deleted!" });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
