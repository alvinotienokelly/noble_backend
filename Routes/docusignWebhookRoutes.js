// Routes/docusignWebhookRoutes.js
const express = require("express");
const { handleWebhook } = require("../Controllers/docusignWebhookController");

const router = express.Router();

router.post("/webhook", handleWebhook);

module.exports = router;