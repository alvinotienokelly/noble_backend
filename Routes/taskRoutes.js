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
  filterTasks,
  assignTaskToUser,
  changeTaskStatus,
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
router.get("/filter/tasks", authMiddleware, filterTasks);
router.post("/assign/user", authMiddleware, assignTaskToUser);
router.put("/change/status", authMiddleware, changeTaskStatus);

module.exports = router;