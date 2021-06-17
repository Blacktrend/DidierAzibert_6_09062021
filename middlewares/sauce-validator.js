const {body, validationResult} = require("express-validator");

module.exports = async (req, res, next) => {
    body("name").notEmpty().trim().escape();
    body("manufacturer").notEmpty().trim().escape();
    body("description").notEmpty().trim().escape();
    body("mainPepper").notEmpty().trim().escape();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
}