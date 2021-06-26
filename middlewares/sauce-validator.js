const {body, validationResult} = require("express-validator");
const fs = require("fs"); // needed to delete file if validation errors
const httpStatus = require("http-status");

exports.bodyParse = (req, res, next) => {

    req.body = req.file ? // if image (sauce creation or modification)
        {
            ...JSON.parse(req.body.sauce),
            // req.file = multer property - req.protocol = Node property - req.get() = Node method
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : req.body;
    next();
}


exports.validate = [
    // trim before notEmpty !!!
    body("name", "name must be fulfilled").trim().notEmpty().blacklist("\\!\\<\\>\\*\\[\\]\\{\\}\\+\\?\\=\\/"),
    body("manufacturer", "manufacturer must be fulfilled").trim().notEmpty().blacklist("\\!\\<\\>\\*\\[\\]\\{\\}\\+\\?\\=\\/"),
    body("description", "description must be fulfilled").trim().notEmpty().blacklist("\\!\\<\\>\\*\\[\\]\\{\\}\\+\\?\\=\\/"),
    body("mainPepper", "main pepper must be fulfilled").trim().notEmpty().blacklist("\\!\\<\\>\\*\\[\\]\\{\\}\\+\\?\\=\\/"),
    body("heat", "heat rating must be given between 1 and 10").trim().notEmpty().isInt({min: 1, max: 10})
]


exports.validationErrors = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // must delete image
        const filename = req.file.filename;
        await fs.unlink(`images/${filename}`, (err => {
            if (err) console.error(err);
            else {
                console.log("\nDeleted file: " + filename);
            }
        }));
        return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
}



