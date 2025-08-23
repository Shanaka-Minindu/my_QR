import express from "express";
import authRoutes from "./auth.routes.js";
import { userDetails, updateUser } from "../controllers/userProfileController.js";
import auth from "../middlewares/auth.middleware.js";
import { QrUrlCreate,FindRedirectUrl, updateUrl } from "../controllers/qrUrlController.js";
import { allQrSub, singleQrSub, allQrInfo } from "../controllers/subscriptionController.js";

const router = express.Router();


router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Auth API running" });
});

router.get("/shanaka",auth,userDetails);
router.post("/qrurl", QrUrlCreate );
router.get("/autoRedirect/:qid",FindRedirectUrl);
router.post("/qrurlwithauth",auth,QrUrlCreate);
router.patch("/userupdare", auth,updateUser );
router.patch("/updateurl", auth,updateUrl );



router.post("/allqrsub",auth,allQrSub)
router.post("/singleqrsub",auth,singleQrSub);
router.get("/allqrinfo",auth,allQrInfo);




export default router;
