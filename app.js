const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const sauceRoutes = "";
const userRoutes = "";

// MongoDB Atlas connection
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBCLUSTER}.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true })
    .then( () => console.log("Connexion à MongoDB réussie !"))
    .catch( (err) => console.log("Connexion à MongoDB échouée ! Erreur : " + err));

// Headers






module.exports = app;