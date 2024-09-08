const controllers = require("../controllers");

const router = require("express").Router()

router.post("/login", controllers.Login)
router.post("/users/:id", controllers.getUserById)
router.all("/sso", controllers.ssoLogin)

module.exports = router;