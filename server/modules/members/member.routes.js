const express = require("express");
const { memberController } = require("./member.controller");
// const { requireAuth } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", memberController.list);
router.get("/:id", memberController.detail);
router.post("/", memberController.create);
router.put("/:id", memberController.update);
router.delete("/:id", memberController.delete);

module.exports = router;
