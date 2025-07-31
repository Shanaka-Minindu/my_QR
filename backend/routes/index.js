import express from "express";
import authRoutes from "./auth.routes.js";

import auth from "../middlewares/auth.middleware.js";
const router = express.Router();


router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Auth API running" });
});

router.get("/shanaka",auth, (req,res)=>{
  res.json({ message: "This is a protected route", user: req.user });
})
export default router;
