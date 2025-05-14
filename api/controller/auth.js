require('dotenv').config(); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysqlPool = require("../../config/db");
const { validashionShema } = require("../../validation/validation");
const { up } = require('../../migrations/20250508085413-create-user');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields" });
  }

  try {
    // Check if user exists
    const [existingUser] = await mysqlPool.query(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Validate input
    const validationResult = validashionShema({ email, password });
    if (!validationResult.success) {
      return res.status(400).json(validationResult);
    }

    // Hash password and insert user
    const hashedPassword = await bcrypt.hash(password, 8);
    const [result] = await mysqlPool.query(
      "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    if (result.affectedRows === 0) {
      return res
        .status(500)
        .json({ success: false, message: "User registration failed" });
    }

    // Create token
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    if (!token) {
      return res
        .status(500)
        .json({ success: false, message: "Token generation failed" });
    }

    // Set cookie and send success response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: result.insertId, username, email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter email" });
  } else if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter password" });
  }

  try {
    const [rows] = await mysqlPool.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateuser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all fields" });
  }

  try {
    // Validate input
    const validationResult = validashionShema({ email, password });
    if (!validationResult.success) {
      return res.status(400).json(validationResult);
    }

    // Hash password and update user
    const hashedPassword = await bcrypt.hash(password, 8);
    const [result] = await mysqlPool.query(
      "UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?",
      [username, email, hashedPassword, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(500)
        .json({ success: false, message: "User update failed" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: { id, username, email },
    });
  } catch (error) {
    console.error("Update error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Please provide a user ID" });
  }

  try {
    const [result] = await mysqlPool.query("DELETE FROM user WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  updateuser,
  deleteUserById,
};


