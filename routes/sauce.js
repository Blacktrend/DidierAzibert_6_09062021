const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config"); // must be after auth middleware !!
const validator = require("../middlewares/sauce-validator");
const sauceCtrl = require("../controllers/sauce");


router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, validator.bodyParse, validator.validate, validator.validationErrors, sauceCtrl.createSauce);
router.put("/:id", auth, multer, validator.bodyParse, validator.validate, validator.validationErrors, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce); // fs is already imported in controller
router.post("/:id/like", auth, sauceCtrl.likeSauce);


module.exports = router;
