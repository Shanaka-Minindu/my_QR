import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import passport from "passport";


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
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store token in HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.redirect("/protected"); // Or send JSON with token
  }
);


export default router;
