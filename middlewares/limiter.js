const rateLimit = require("express-rate-limit");

exports.userLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes only for test purpose
    max: 6, // block after 6 requests
    message: "too many signup or login attempts, try again after 1 hour"
});

exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "too many requests, try again after 15 minutes"
});





