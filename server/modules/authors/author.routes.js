const router = require("express").Router();

const { authorController } = require("./author.controller");

const authMiddleware = require("../../middleware/auth");

router.get("/", authorController.list);
router.get("/:id", authorController.detail);
router.post("/", authMiddleware, authorController.create);
router.put("/:id", authMiddleware, authorController.update);
router.delete("/:id", authMiddleware, authorController.delete);

module.exports = router;
