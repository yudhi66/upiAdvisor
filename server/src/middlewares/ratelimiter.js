import redis from "../db/redis.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const WINDOW_DURATION = 60;
const MAX_REQUESTS = 10;

export const rateLimiter = asyncHandler(async (req, res, next) => {
    const ip = req.ip;
    const key = `rate_limit:${ip}`;

    const current = await redis.get(key);

    if (current && current >= MAX_REQUESTS) {
        throw new ApiError(429, "Too many requests, please try again later");
    }

    if (!current) {
        await redis.set(key, 1, "EX", WINDOW_DURATION);
    } else {
        await redis.incr(key);
    }

    next();
});