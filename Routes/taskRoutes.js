// Routes/taskRoutes.js
const express = require("express");
const taskController = require("../Controllers/taskController");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskByDealId,
  getTasksByUserId,
  getTasksByDueDateRange,
} = taskController;
const authMiddleware = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.get("/user/:userId", authMiddleware, getTasksByUserId);
router.get("/deal/:dealId", authMiddleware, getTaskByDealId);
router.get("/date/due-date-range", authMiddleware, getTasksByDueDateRange);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
