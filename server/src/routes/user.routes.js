import { Router } from "express";
import { rateLimiter } from "../middlewares/ratelimiter.js";
import { createUser, loginUser, logOutUser, updatePassword, getUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateOtp, validateOtp } from "../controller/forgotPassword.js";
import { sanitizeInput } from "../middlewares/inputSantization.js";
const router = Router();



router.route("/register").post(sanitizeInput, rateLimiter, createUser)
router.route("/login").post(sanitizeInput, rateLimiter, loginUser)

router.route("/logout").get(verifyJWT, logOutUser);

router.route("/updatePassword").post(sanitizeInput, verifyJWT, updatePassword);

router.route("/generateOtp").post(sanitizeInput, rateLimiter, generateOtp);
router.route("/validateOtp").post(sanitizeInput, rateLimiter, validateOtp);
router.route("/getUser").get(getUser);








export default router;