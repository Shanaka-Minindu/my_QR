import express from "express";
import authRoutes from "./auth.routes.js";
import { userDetails } from "../controllers/userProfileController.js";
import auth from "../middlewares/auth.middleware.js";
import { QrUrlCreate,FindRedirectUrl } from "../controllers/qrUrlController.js";
const router = express.Router();


router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Auth API running" });
});

router.get("/shanaka",auth,userDetails);
router.post("/qrurl",auth, QrUrlCreate );
router.get("/autoRedirect/:qid",FindRedirectUrl);
export default router;
