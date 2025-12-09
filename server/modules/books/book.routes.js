const router = require("express").Router();

const { bookController } = require("./book.controller");

const authMiddleware = require("../../middleware/auth");

router.get("/", bookController.list);
router.get("/:id", bookController.detail);
router.post("/", authMiddleware, bookController.create);
router.put("/:id", authMiddleware, bookController.update);
router.delete("/:id", authMiddleware, bookController.delete);

module.exports = router;
