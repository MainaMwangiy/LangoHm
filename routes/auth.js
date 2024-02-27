const controllers = require("../controllers");

const router = require("express").Router()

router.post("/login", controllers.Login)
router.post("/users/:id", controllers.getUserById)

module.exports = router;