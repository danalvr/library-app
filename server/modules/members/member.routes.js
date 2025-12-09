const router = require("express").Router();

const { memberController } = require("./member.controller");

const authMiddleware = require("../../middleware/auth");

router.get("/", memberController.list);
router.get("/:id", memberController.detail);
router.post("/", authMiddleware, memberController.create);
router.put("/:id", authMiddleware, memberController.update);
router.delete("/:id", authMiddleware, memberController.delete);

module.exports = router;
