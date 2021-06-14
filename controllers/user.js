const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const dotenv = require("dotenv");
//dotenv.config();

exports.signup = async (req, res) => {
    await bcrypt.hash(req.body.password, 10)
        .then( async hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            await user.save()
                .then( () => res.status(201).json({message: "Utilisateur créé !"}))
                .catch(err => res.status(400).json({error: err}));
        })
        .catch(err => res.status(500).json({error: err}));
}

exports.login = async (req, res) => {
    await User.findOne({email: req.body.email})
        .then(async user => {
            if (!user) {
                return res.status(401).json({error: "Utilisateur non trouvé !"});
            }
            await bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: "Mot de passe incorrect !" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({userId: user._id}, `${process.env.JWTSALT}`, {expiresIn: "24h"})
                    });
                })
                .catch(err => res.status(500).json({error: err}));
        })
        .catch(err => res.status(500).json({error: err}));
}