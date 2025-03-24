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
  user: "root",  // Replace with your MySQL username
  password: "root",  // Replace with your MySQL password
  database: "flipkart_clone",  // Replace with your database name
  multipleStatements: true
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
      console.error("❌ Database Connection Failed:", err);
      process.exit(1); // Exit process if connection fails
  }
  console.log("✅ Connected to MySQL Database!");
});

module.exports = db;

/** ================= USER MANAGEMENT APIs ================= **/

// User Signup
app.post("/api/signup", (req, res) => {
  const { name, email, password, userType } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    db.query(
      "INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)",
      [name, email, password, userType || "customer"],
      (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Signup successful!" });
      }
    );
  });
});

// User Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length === 0 || result[0].password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        userType: result[0].user_type,
      },
    });
  });
});

// Get All Users (Admin Only)
app.get("/api/users", (req, res) => {
  db.query("SELECT id, name, email, user_type FROM users", (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

// Get User by ID
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, name, email, user_type FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result[0]);
  });
});

// Update User
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, userType } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  db.query(
    "UPDATE users SET name=?, email=?, password=?, user_type=? WHERE id=?",
    [name, email, password || null, userType || "customer", id],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ message: "User updated successfully!" });
    }
  );
});

/** ================= PRODUCT MANAGEMENT APIs ================= **/

// Get All Products
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

// Get Product by ID
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(result[0]);
  });
});

// Add a New Product
// Add a New Product
app.post("/api/products", (req, res) => {
  const { name, price, rating, category, des, image } = req.body;

  if (!name || !price || !rating || !category || !des || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "INSERT INTO products (name, price, rating, category, des, image) VALUES (?, ?, ?, ?, ?, ?)",
    [name, price, rating, category, des, image],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({ message: "Product added successfully", productId: result.insertId });
    }
  );
});
//delete product by id 

// Delete a Product
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully!" });
  });
});



// Update Product
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, rating, category, image, des, brand } = req.body;

  if (!name || !price || !rating || !category || !des || !image || !brand) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "UPDATE products SET name=?, price=?, rating=?, category=?, image=?, des=?, brand=? WHERE id=?",
    [name, price, rating, category, image, des, brand, id],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product updated successfully!" });
    }
  );
});


/** ================= ORDER MANAGEMENT APIs ================= **/

// Place Order
app.post("/api/orders", (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query("SELECT price FROM products WHERE id = ?", [productId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const total_price = result[0].price * quantity;

    db.query(
      "INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)",
      [userId, productId, quantity, total_price],
      (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Order placed successfully!" });
      }
    );
  });
});

// Get Order History
app.get("/api/orders/user/:userId", (req, res) => {
  const { userId } = req.params;
  db.query("SELECT * FROM orders WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

// Start the Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
