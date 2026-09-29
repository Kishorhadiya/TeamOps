import pool from "../config/pg.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.TOKEN_1 || "default_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_refresh_key";

// ── Helper: create both tokens
const generateTokens = (adminId) => {
  const accessToken = jwt.sign({ userid: adminId }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userid: adminId }, REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

// ── SIGNUP
export const adminsignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await pool.query("SELECT * FROM admin WHERE email=$1", [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO admin(email, password) VALUES($1,$2) RETURNING id, email",
      [email, hash]
    );

    const admin = result.rows[0];
    const { accessToken, refreshToken } = generateTokens(admin.id);

    return res.status(201).json({
      message: "Signup successfully",
      admin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── SIGNIN
export const adminsignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM admin WHERE email=$1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin does not exist" });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is not valid" });
    }

    delete admin.password;
    const { accessToken, refreshToken } = generateTokens(admin.id);

    return res.status(200).json({
      message: "Admin signin successfully",
      admin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── REFRESH TOKEN → gives new accessToken
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // Check admin still exists
    const result = await pool.query("SELECT id, email FROM admin WHERE id=$1", [decoded.userid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result.rows[0];

    // Generate new access token (keep same refresh token)
    const newAccessToken = jwt.sign({ userid: admin.id }, ACCESS_SECRET, { expiresIn: "15m" });

    return res.status(200).json({
      message: "Token refreshed",
      admin,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// ── GET ALL USERS (employees)
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users ORDER BY id ASC"
    );
    return res.status(200).json({ users: result.rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
