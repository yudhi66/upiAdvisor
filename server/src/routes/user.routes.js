import { Router } from "express";

import { loginUser } from "../controller/user.controller.js";


const router=Router();



router.route("/login").get(loginUser)









export default router;