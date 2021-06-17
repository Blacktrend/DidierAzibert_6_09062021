const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config"); // must be after auth middleware !!
const sauceCtrl = require("../controllers/sauce");
const valid = require("../middlewares/sauce-validator");

router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, valid, sauceCtrl.createSauce); // need multer-config to use filename (not imported in controler
router.put("/:id", auth, multer, valid, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce); // fs is already imported in controler
router.post("/:id/like", auth, sauceCtrl.likeSauce);


module.exports = router;
