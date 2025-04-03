const express = require("express");
const settingsController = require("../Controllers/settingsController");
const { getSettings, updateSettings } = settingsController;

const router = express.Router();

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get system settings
 *     responses:
 *       200:
 *         description: Returns the system settings.
 *   put:
 *     summary: Update system settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               timezone:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully.
 */

router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;
