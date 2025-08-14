import db from "../config/db.js";
import bcrypt from "bcrypt";

import { generateToken } from "../utils/token.util.js";

const saltRounds = 10;

export const register = async (req, res) => {
  const { email, password, userName } = req.body;

  if (!email || !password || !userName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const user = await db.query(
      "INSERT INTO users (email, hash_password, userName) VALUES ($1, $2, $3) RETURNING id, email, userName",
      [email, hash, userName]
    );


    const token = generateToken({
        email: user.rows[0].email,
        userName: user.rows[0].username,
        createAt: user.rows[0].created_at,
      });

    res .cookie("token", token, {
        httpOnly: true,
        secure: "production",
        sameSite: "lax", 
        maxAge: 24 * 60 * 60 * 1000, 
      }).status(200).json({
      success: true,
      uName : user.rows[0].username,
      email : user.rows[0].email
    });
    //------------------- Cookie -----------------------

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].hash_password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
        email: user.rows[0].email,
        userName: user.rows[0].username,
        createAt: user.rows[0].created_at,
      });

    res .cookie("token", token, {
        httpOnly: true,
        secure: "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      }).status(200).json({
      success: true,
      uName : user.rows[0].username,
      email : user.rows[0].email
    });

      //------------------- Cookie -----------------------


      
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req,res) =>{
   res.clearCookie("token").json({ message: "Logged out" });
}
