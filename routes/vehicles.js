const controllers = require("../controllers");

const router = require("express").Router()

router.post("/list", controllers.ListVehicle)

module.exports = router;