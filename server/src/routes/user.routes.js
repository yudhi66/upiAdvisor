import { Router } from "express";

import { createUser,loginUser,logOutUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();



router.route("/register").post(createUser)
router.route("/login").post(loginUser)

router.route("/logout").get(verifyJWT,logOutUser);










export default router;