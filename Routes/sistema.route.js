const Router = require("express");
const { asureAuth } = require("../middlewares/authenticated");

const { login } = require("../controllers/sistema.controller.js");

const router = Router();


router.post("/login", login)

module.exports = router;
