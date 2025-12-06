const express = require("express");
const { authorController } = require("./author.controller");
// const { requireAuth } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", authorController.list);
router.get("/:id", authorController.detail);
router.post("/", authorController.create);
router.put("/:id", authorController.update);
router.delete("/:id", authorController.delete);

module.exports = router;
