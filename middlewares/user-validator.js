const {body, validationResult} = require("express-validator");
const httpStatus = require("http-status");


exports.validate = [
    // trim before notEmpty !!!
    body("email", "email is mandatory").trim().notEmpty(),
    body("email", "not a valid email").isEmail().normalizeEmail(),
    body("password", "password is missing").notEmpty(),
    body("password", "password must contain at least 6 car.").isLength({min: 6})
]


exports.validationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
    next();
}