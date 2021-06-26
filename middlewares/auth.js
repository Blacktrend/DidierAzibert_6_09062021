const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, `${process.env.JWTSALT}`);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !==userId) {
            //throw new Error("Identifiant invalide !");
            return res.status(httpStatus.UNAUTHORIZED).json({error: "Identifiant invalide !"});
        }
        next();
    }
    catch (err) {
        return res.status(httpStatus.UNAUTHORIZED).json(err);
    }
}
