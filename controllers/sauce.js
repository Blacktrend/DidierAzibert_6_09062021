const Sauce = require("../models/sauce");
const fs = require("fs"); // core module file system needed for deleteSauce


exports.createSauce = (req, res) => {
    // file + data expected, so need of JSON.parse for data
    const sauceObject = JSON.parse(req.body.sauce); // VERIFIER que sauce est bien dans le corps de la req
    //delete sauceObject._id; // VOIR SI un _id est dans le corps de la requête envoyée par le Front ?
    const sauce = new Sauce( {
        //...sauceObject, // we can use spread
        userId: sauceObject.userId,
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        // req.file = multer property - req.protocol = Node property - req.get() = Node method
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        heat: sauceObject.heat,
        likes: sauceObject.likes,
        dislikes: sauceObject.dislikes,
        usersLiked: sauceObject.usersLiked,
        usersDisliked: sauceObject.usersDisliked
    });
    sauce.save()
        .then( () => res.status(201).json({message: "Sauce enregistrée !"}))
        .catch(err => res.status(400).json({error: err}));
}


exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? // if there's an image (modified)
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : {...req.body}; // if no image, simply spread body
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then( () => res.status(201).json({message: "Sauce mise à jour !"}))
        .catch(err => res.status(400).json({error: err}));
}


exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id}) // we need first to delete image with fs
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1]; // get only filename
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then( () => res.status(200).json({message: "Sauce supprimée !"}))
                    .catch(err => res.status(500).json({error: err}));
            });
        })
        .catch(err => res.status(500).json({error: err}));
}


exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(err => res.status(404).json({error: err}));
}


exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(err => res.status(400).json({error: err}));
}

// reste à faire : controler like