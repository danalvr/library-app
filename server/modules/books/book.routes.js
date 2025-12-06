const express = require("express");
const { bookController } = require("./book.controller");
// const { requireAuth } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", bookController.list);
router.get("/:id", bookController.detail);
router.post("/", bookController.create);
router.put("/:id", bookController.update);
router.delete("/:id", bookController.delete);

module.exports = router;
