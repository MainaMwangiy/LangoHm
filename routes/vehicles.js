const controllers = require("../controllers");

const router = require("express").Router()

router.post("/list", controllers.ListVehicle)
router.post("/list/:id", controllers.getUserVehicleDetails)

module.exports = router;