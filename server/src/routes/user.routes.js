import { Router } from "express";

import { createUser,loginUser,logOutUser,updatePassword,getUser} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateOtp ,validateOtp} from "../controller/forgotPassword.js";

const router=Router();



router.route("/register").post(createUser)
router.route("/login").post(loginUser)

router.route("/logout").get(verifyJWT,logOutUser);

router.route("/updatePassword").post(verifyJWT,updatePassword);

router.route("/generateOtp").post(generateOtp);
router.route("/validateOtp").post(validateOtp);
router.route("/getUser").get(getUser);
 







export default router;