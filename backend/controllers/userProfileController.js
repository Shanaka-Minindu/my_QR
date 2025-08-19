import db from "../config/db.js";
import bcrypt from "bcrypt";

import { generateToken } from "../utils/token.util.js";


export const userDetails = async (req, res) => {
  const userEmail = req.user.email;
  const userId = req.user.userId;
  const userName = req.user.userName;
  const createAt = req.user.createAt;
console.log(userId)
  try {
    const qrData = await db.query(
      "SELECT id, scan_count as scancount, package_type as package, redirect_url as url FROM qr_data WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );

    res.status(200).json({
      user: { userEmail, userName, createAt, userId },
      qrData: qrData.rows,
    });
  } catch (err) {}
};

export const updateUser = async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const userId = req.user.userId;
  const saltRounds = 10;

  const updatedFields = [];

  if (req.body.name !== undefined) {
    updatedFields.push(`username = '${req.body.name}'`);
  }
  if (req.body.password && req.body.newPassword === req.body.confirmPassword) {
    const curruntPass = await db.query("SELECT hash_password FROM users WHERE user_id = $1", [userId]);
    const checkIsValid = await bcrypt.compare(req.body.password, curruntPass.rows[0].hash_password);

    if(checkIsValid){
        const newHash = await bcrypt.hash(req.body.newPassword, saltRounds);
        updatedFields.push(`hash_password = '${newHash}'`);
    } else {
        return res.status(400).json({ error: "Current password is not matching.." });
    }
  }

  // If no fields to update, return early
  if (updatedFields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const query = `UPDATE users SET ${updatedFields.join(", ")} WHERE id='${userId}' RETURNING *`;
  console.log(query);
  
  try {
    const response = await db.query(query);
    console.log(response.rows[0]);
    
    const token = generateToken({
      email: response.rows[0].email,
      userName: response.rows[0].username,
      createAt: response.rows[0].created_at,
      userId: response.rows[0].id
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Better to check environment
      sameSite: "lax", 
      maxAge: 24 * 60 * 60 * 1000, 
    }).status(200).json({
      success: true,
      uName: response.rows[0].username, // Fixed: changed 'user' to 'response'
      email: response.rows[0].email,    // Fixed: changed 'user' to 'response'
      userId: response.rows[0].id       // Fixed: changed 'user' to 'response'
    });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
