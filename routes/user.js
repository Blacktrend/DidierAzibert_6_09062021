const express = require("express");
const router = express.Router();
const limiter = require("../middlewares/limiter");
const validator = require("../middlewares/user-validator");
const userCtrl = require("../controllers/user");


router.post("/signup", limiter.userLimiter, validator.validate, validator.validationErrors, userCtrl.signup);
router.post("/login", limiter.userLimiter, userCtrl.login);

module.exports = router;