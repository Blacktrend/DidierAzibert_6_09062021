const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");

exports.signup = (req, res) => {

    bcrypt.hash(req.body.password, 10)
        .then( hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then( () => res.status(httpStatus.CREATED).json({message: "Utilisateur créé !"}))
                .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err));
}

exports.login = (req, res) => {
    User.findOne({email: req.body.email})
        .then( user => {
            if (!user) {
                return res.status(httpStatus.UNAUTHORIZED).json({error: "Utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(httpStatus.UNAUTHORIZED).json({error: "Mot de passe incorrect !" });
                    }
                    res.status(httpStatus.OK).json({
                        userId: user._id,
                        token: jwt.sign({userId: user._id}, `${process.env.JWTSALT}`, {expiresIn: "24h"})
                    });
                })
                .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err));
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err));
}