const Sauce = require("../models/sauce");
const fs = require("fs"); // core module file system needed for deleteSauce
const httpStatus = require("http-status");


exports.createSauce = (req, res) => {
    // file + data expected, so need JSON.parse of data (in sauce-validator middleware)
    const sauce = new Sauce( {
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then( () => res.status(httpStatus.CREATED).json({message: "Sauce enregistrée !"}))
        .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
}


exports.modifySauce = (req, res) => {
    // if file, need JSON.parse of data (in sauce-validator middleware)
    if (req.body.imageUrl) { // if new image
        Sauce.findOne({_id: req.params.id}) // we need to delete old image
            .then( sauce => {
                const filename = sauce.imageUrl.split("/images/")[1]; // get only filename
                fs.unlink(`images/${filename}`, (err => { // delete
                    if (err) console.error(err);
                    else {
                        console.log("\nDeleted file: " + filename);
                    }
                }));
            })
            .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err));
    }
    
    Sauce.updateOne({_id: req.params.id}, req.body)
        .then( () => res.status(httpStatus.CREATED).json({message: "Sauce mise à jour !"}))
        .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
}


exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id}) // we need first to delete image with fs
        .then( sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`,  () => {
                Sauce.deleteOne({_id: req.params.id}) // delete in db after fs unlink
                    .then( () => res.status(httpStatus.OK).json({message: "Sauce supprimée !"}))
                    .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err));
            });
        })
        .catch(err => res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err));
}


exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(httpStatus.OK).json(sauce))
        .catch(err => res.status(httpStatus.NOT_FOUND).json(err));
}


exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(httpStatus.OK).json(sauces))
        .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
}


exports.likeSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id}) // id param in request url
        .then( sauce => {
            const userId = req.body.userId;
            const likedIndex = sauce.usersLiked.indexOf(userId); // check if user has already liked
            const dislikedIndex = sauce.usersDisliked.indexOf(userId); // check if user has already disliked

            switch(req.body.like) {
                case 1:
                    if (likedIndex < 0) {
                        sauce.usersLiked.push(userId);
                        sauce.likes++;
                    }
                    break;
                case -1:
                    if (dislikedIndex < 0) {
                        sauce.usersDisliked.push(userId);
                        sauce.dislikes++;
                    }
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
                    return res.status(httpStatus.BAD_REQUEST).console.error("Erreur de gestion du like !");
            }

            Sauce.updateOne({_id: req.params.id}, sauce)
                .then( () => {
                    res.status(httpStatus.CREATED).json({message: "Vote enregistré !"});
                })
                .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
        })
        .catch(err => res.status(httpStatus.BAD_REQUEST).json(err));
}