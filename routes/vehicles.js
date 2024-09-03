const controllers = require("../controllers");

const router = require("express").Router()

router.all("/list", controllers.ListVehicle)
router.all("/list/:id", controllers.getUserVehicleDetails)

module.exports = router;