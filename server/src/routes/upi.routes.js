import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reporting } from "../controller/reporting.controller.js";
import { rateLimiter } from "../middlewares/ratelimiter.js";
import { sanitizeInput } from "../middlewares/inputSantization.js";
import { fetchReport } from "../controller/fetchingReport.controller.js";
import { createComment, fetchComment, deleteComment } from "../controller/commenting.controller.js";
const router = Router();


router.route("/report").post(sanitizeInput, verifyJWT, rateLimiter, reporting);

router.route("/fetchReport").post(sanitizeInput, rateLimiter, fetchReport)


router.route("/createComment").post(sanitizeInput, rateLimiter, verifyJWT, createComment)

router.route("/getComment").post(sanitizeInput, rateLimiter, fetchComment)

router.route("/deleteComment").post(sanitizeInput, verifyJWT, deleteComment)




export default router;