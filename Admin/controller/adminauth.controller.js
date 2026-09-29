import "dotenv/config";
import pool from "../config/pg.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAccessSecret = () => process.env.TOKEN_1 || "default_secret_key";
const getRefreshSecret = () => process.env.REFRESH_SECRET || "default_refresh_key";

// ── Helper: create both tokens
const generateTokens = (adminId) => {
  const accessToken = jwt.sign({ userid: adminId }, getAccessSecret(), {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userid: adminId }, getRefreshSecret(), {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// ── SIGNUP
export const adminsignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const exists = await pool.query("SELECT * FROM admin WHERE LOWER(email) = $1", [
      cleanEmail,
    ]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO admin(email, password) VALUES($1, $2) RETURNING id, email",
      [cleanEmail, hash]
    );

    const admin = result.rows[0];
    const { accessToken, refreshToken } = generateTokens(admin.id);

    return res.status(201).json({
      message: "Admin registered successfully",
      admin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("adminsignup error:", error);
    return res.status(500).json({ message: error.message || "Failed to register admin" });
  }
};

// ── SIGNIN
export const adminsignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const result = await pool.query("SELECT * FROM admin WHERE LOWER(email) = $1", [
      cleanEmail,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin account not found" });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    delete admin.password;
    const { accessToken, refreshToken } = generateTokens(admin.id);

    return res.status(200).json({
      message: "Admin signed in successfully",
      admin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("adminsignin error:", error);
    return res.status(500).json({ message: error.message || "Failed to sign in" });
  }
};

// ── REFRESH TOKEN → gives new accessToken
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, getRefreshSecret());

    // Check admin still exists
    const result = await pool.query("SELECT id, email FROM admin WHERE id = $1", [
      decoded.userid,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result.rows[0];

    // Generate new access token
    const newAccessToken = jwt.sign({ userid: admin.id }, getAccessSecret(), {
      expiresIn: "15m",
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
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
      "SELECT id, username, email FROM users ORDER BY username ASC NULLS LAST, id ASC"
    );
    return res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch users" });
  }
};
