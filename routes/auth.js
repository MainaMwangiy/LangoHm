const controllers = require("../controllers");

const router = require("express").Router()

router.post("/login", controllers.Login)
router.post("/register", controllers.Register)
router.get("/users", controllers.getUsers)
router.post("/delete", controllers.softDeleteUsers)
router.get("/getdeleted", controllers.getAllSoftDeletedUsers)
router.get("/active", controllers.getAllActiveUsers)
router.put("/editUpdate/:id", controllers.editUsers)
router.get("/profile/:id", controllers.getProfile)

module.exports = router;