const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema( {
    // constraints here are duplicates of sauce-validator for additional security
    userId: {type: String, required: true},
    name: {type: String, trim: true, required: true},
    manufacturer: {type: String, trim: true, required: true},
    description: {type: String, trim: true, required: true},
    mainPepper: {type: String, trim: true, required: true},
    imageUrl: {type: String, trim: true, required: true},
    heat: {type: Number, trim: true, required: true, min: 1, max: 10},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: Array},
    usersDisliked: {type: Array}
});

module.exports = mongoose.model("Sauce", sauceSchema);