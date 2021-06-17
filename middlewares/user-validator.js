const {body, validationResult} = require("express-validator");

module.exports = async (req, res, next) => {
    body("email").isEmail().normalizeEmail();
    body("password").isLength({min: 5});
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
}