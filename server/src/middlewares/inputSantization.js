import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import xss from "xss";
import validator from "validator";

const sqlInjectionPatterns = /\b(\$(ne|gt|lt|gte|lte|regex|where|or|and))\b/gi;

export const sanitizeInput = asyncHandler(async (req, res, next) => {
    try {
        const sanitize = (data) => {
            if (typeof data === "string") {
                let sanitized = xss(validator.escape(data));
                sanitized = sanitized.replace(sqlInjectionPatterns, "");
                return sanitized;
            } else if (Array.isArray(data)) {
                return data.map(sanitize);
            } else if (typeof data === "object" && data !== null) {
                for (const key in data) {
                    data[key] = sanitize(data[key]);
                }
            }
            return data;
        };

        req.body = sanitize(req.body);
        req.query = sanitize(req.query);
        req.params = sanitize(req.params);

        next();
    } catch (error) {
        throw new ApiError(400, "Invalid input detected");
    }
});
