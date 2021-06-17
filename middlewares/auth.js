const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, `${process.env.JWTSALT}`);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !==userId) {
            //throw new Error("Identifiant invalide !");
            return res.status(401).json({error: "Identifiant invalide !"});
        }
        next();
    }
    catch (err) {
        return res.status(401).json(err);
    }
}
