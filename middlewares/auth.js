const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, `${process.env.JWTSALT}`);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !==userId) {
            throw new Error("Identifiant invalide !");
        }
        next();
    }
    catch (err) {
        return res.status(401).json({error: err});
    }
}
