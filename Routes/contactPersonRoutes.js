// Routes/contactPersonRoutes.js
const express = require("express");
const contactPersonController = require("../Controllers/contactPersonController");
const {
  createContactPerson,
  getContactPersons,
  getContactPersonById,
  updateContactPerson,
  deleteContactPerson,
  getContactPersonsByUser
} = contactPersonController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createContactPerson);
router.get("/", authMiddleware, getContactPersons);
router.get("/:id", authMiddleware, getContactPersonById);
router.put("/:id", authMiddleware, updateContactPerson);
router.delete("/:id", authMiddleware, deleteContactPerson);
router.get("/user/contacts", authMiddleware, getContactPersonsByUser);

module.exports = router;