const {body, validationResult} = require("express-validator");

exports.bodyParse = (req, res, next) => {

    req.body = req.file ? // if there's an image (creation or modification)
        {
            ...JSON.parse(req.body.sauce),
            // req.file = multer property - req.protocol = Node property - req.get() = Node method
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : req.body;
    next();
}


exports.validate = [
    body("name", "name must be fulfilled").notEmpty().trim().escape()
]


exports.validationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
}



