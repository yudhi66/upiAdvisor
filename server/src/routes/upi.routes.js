import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reporting } from "../controller/reporting.controller.js";

const router=Router();


router.route("/report").post(verifyJWT,reporting);




export default router;