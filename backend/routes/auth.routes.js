import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import passport from "passport";
import { generateToken } from "../utils/token.util.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
// Google login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const tokenData = {
      email: req.user.email,
      userName: req.user.username,
      createAt: req.user.created_at,
      userId : req.user.id
    };

    const token = generateToken(tokenData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with user info in query params
    res.redirect(`http://localhost:3000/user?uName=${encodeURIComponent(req.user.username)}&email=${encodeURIComponent(req.user.email)}&uid=${encodeURIComponent(req.user.id)}`);
  }
);



export default router;
