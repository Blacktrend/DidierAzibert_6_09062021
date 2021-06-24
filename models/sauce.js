const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema( {
    userId: {type: String, required: true},
    name: {type: String, required: true, trim: true},
    manufacturer: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    mainPepper: {type: String, required: true, trim: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true, min: 1, max: 10},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: Array},
    usersDisliked: {type: Array}
});

module.exports = mongoose.model("Sauce", sauceSchema);