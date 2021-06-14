const Sauce = require("../models/sauce");
const fs = require("fs"); // core module file system needed for deleteSauce


exports.createSauce = async (req, res) => {
    // file + data expected, so need of JSON.parse for data
    const sauceObject = await JSON.parse(req.body.sauce);
    const sauce = await new Sauce( {
        //...sauceObject, // we can use spread
        userId: sauceObject.userId,
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        // req.file = multer property - req.protocol = Node property - req.get() = Node method
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        heat: sauceObject.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    await sauce.save()
        .then( () => res.status(201).json({message: "Sauce enregistrée !"}))
        .catch(err => res.status(400).json(err));
}


exports.modifySauce = async (req, res) => {
    const sauceObject = await req.file ? // if there's an image (modified)
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : {...req.body}; // if no image, simply spread body
    await Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then( () => res.status(201).json({message: "Sauce mise à jour !"}))
        .catch(err => res.status(400).json(err));
}


exports.deleteSauce = async (req, res) => {
    await Sauce.findOne({_id: req.params.id}) // we need first to delete image with fs
        .then(async sauce => {
            const filename = sauce.imageUrl.split("/images/")[1]; // get only filename
            await fs.unlink(`images/${filename}`, async () => {
                await Sauce.deleteOne({_id: req.params.id}) // delete in db after fs unlink
                    .then( () => res.status(200).json({message: "Sauce supprimée !"}))
                    .catch(err => res.status(500).json(err));
            });
        })
        .catch(err => res.status(500).json(err));
}


exports.getOneSauce = async (req, res) => {
    await Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(err => res.status(404).json(err));
}


exports.getAllSauces = async (req, res) => {
    await Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(err => res.status(400).json(err));
}


exports.likeSauce = async (req, res) => {
    await Sauce.findOne({_id: req.params.id}) // id param in request url
        .then(async sauce => {
            console.log("début de then");
            const userId = req.body.userId;
            const likedIndex = sauce.usersLiked.indexOf(req.body.userId); // check if user has already liked
            const dislikedIndex = sauce.usersDisliked.indexOf(req.body.userId); // check if user has already disliked

            switch(req.body.like) {
                case 1:
                    sauce.usersLiked.push(userId);
                    sauce.likes++;
                    console.log("usersLiked =" + sauce.usersLiked);
                    console.log("likes =" + sauce.likes);
                    break;
                case -1:
                    sauce.usersDisliked.push(userId);
                    sauce.dislikes++;
                    break;
                case 0:
                    if (dislikedIndex >=0) {
                        sauce.usersDisliked.splice(dislikedIndex, 1);
                        sauce.dislikes--;
                    }
                    if (likedIndex >=0) {
                        sauce.usersLiked.splice(likedIndex, 1);
                        sauce.likes--;
                    }
                    break;
                default:
                    return console.error("Erreur de gestion du like/dislike !");
            }
            console.log("fin du switch");
            console.log("sauce = " + sauce);
            console.log("params id = " + req.params.id);
            await Sauce.updateOne({_id: req.params.id}, {sauce, _id: req.params.id})
                .then( () => {
                    res.status(201).json({message: "Vote enregistré !"});
                    console.log("après updateOne");
                })
                .catch(err => res.status(400).json(err));
        })
        .catch(err => {
            res.status(404).json(err);
        });
}