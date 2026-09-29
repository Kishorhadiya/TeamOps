import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/pg.config.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const IsEmail = await pool.query("select * from users where email=$1", [
      email,
    ]);

    if (IsEmail.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      "insert into users(username,email, password) values($1,$2,$3) RETURNING id, username, email",
      [username, email, hashPassword],
    );

    const createdUser = user.rows[0];

    const token = jwt.sign({ userid: createdUser.id }, process.env.TOKEN_1, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "Signup successfully",
      user: createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const sigin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const IsEmail = await pool.query("select * from users where email=$1", [
      email,
    ]);

    if (!IsEmail.rows.length > 0) {
      return res.status(404).json({
        message: "user is not exists",
      });
    }

    const user = IsEmail.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ userid: user.id }, process.env.TOKEN_1, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      message: "Signup successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
