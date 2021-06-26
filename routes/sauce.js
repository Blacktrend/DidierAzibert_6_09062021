const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const limiter = require("../middlewares/limiter");
const multer = require("../middlewares/multer-config"); // must be after auth middleware !!
const validator = require("../middlewares/sauce-validator");
const sauceCtrl = require("../controllers/sauce");


router.get("/", auth, limiter.apiLimiter, sauceCtrl.getAllSauces);
router.get("/:id", auth, limiter.apiLimiter, sauceCtrl.getOneSauce);
router.post("/", auth, limiter.apiLimiter, multer, validator.bodyParse, validator.validate, validator.validationErrors, sauceCtrl.createSauce);
router.put("/:id", auth, limiter.apiLimiter, multer, validator.bodyParse, validator.validate, validator.validationErrors, sauceCtrl.modifySauce);
router.delete("/:id", auth, limiter.apiLimiter, sauceCtrl.deleteSauce); // fs is already imported in controller
router.post("/:id/like", auth, limiter.apiLimiter, sauceCtrl.likeSauce);


module.exports = router;
