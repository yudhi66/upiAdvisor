import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reporting } from "../controller/reporting.controller.js";

import {fetchReport } from "../controller/fetchingReport.controller.js";
const router=Router();


router.route("/report").post(verifyJWT,reporting);

router.route("/fetchReport").post(fetchReport)




export default router;