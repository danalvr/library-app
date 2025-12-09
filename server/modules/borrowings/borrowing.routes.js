const router = require("express").Router();

const { borrowingController } = require("./borrowing.controller");

const authMiddleware = require("../../middleware/auth");

router.get("/", borrowingController.list);
router.get("/:id", borrowingController.detail);
router.post("/", authMiddleware, borrowingController.create);
router.put("/:id", authMiddleware, borrowingController.update);
router.delete("/:id", authMiddleware, borrowingController.remove);

module.exports = router;
