const router = require("express").Router();
const { borrowingController } = require("./borrowing.controller");

router.get("/", borrowingController.list);
router.get("/:id", borrowingController.detail);
router.post("/", borrowingController.create);
router.put("/:id", borrowingController.update);
router.delete("/:id", borrowingController.remove);

module.exports = router;
