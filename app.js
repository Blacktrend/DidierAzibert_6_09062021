const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path"); // get server path (core module)
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose"); // ou ES6 = import mongoose from "mongoose";

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// MongoDB Atlas connection
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBCLUSTER}.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true })
    .then( () => console.log("Connexion à MongoDB réussie !"))
    .catch( (err) => console.log("Connexion à MongoDB échouée ! Erreur : " + err));

// Headers
app.use(helmet());
app.use( async (request, response, next) => {
        response.setHeader("Access-Control-Allow-Origin", "*"); // don't leave * on production
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        next();
});

app.use(express.json());

// images static route
app.use("/images", express.static(path.join(__dirname, "images")));

// routers to use with common path
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);


module.exports = app;