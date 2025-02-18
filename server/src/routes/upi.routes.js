import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reporting } from "../controller/reporting.controller.js";

import {fetchReport } from "../controller/fetchingReport.controller.js";
import { createComment,fetchComment ,deleteComment} from "../controller/commenting.controller.js";
const router=Router();


router.route("/report").post(verifyJWT,reporting);

router.route("/fetchReport").post(fetchReport)


router.route("/createComment").post(verifyJWT,createComment)

router.route("/getComment").post(fetchComment)

router.route("/deleteComment").post(verifyJWT,deleteComment)




export default router;