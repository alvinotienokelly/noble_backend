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
  getTasksForUserDeals,
  getUserTasksByDealId,
} = taskController;
const authMiddleware = require("../Middlewares/authMiddleware");
const checkRole = require("../Middlewares/roleMiddleware");
const checkPermissions = require("../Middlewares/permissionMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  checkPermissions(["CREATE_TASK", "EDIT_DEAL"]),
  createTask
);
router.get("/", authMiddleware, getAllTasks);
router.get("/deal/:dealId/user-tasks", authMiddleware, getUserTasksByDealId); // Add this line
router.get("/user", authMiddleware, getTasksByUserId);
router.get("/:id", authMiddleware, getTaskById);
router.put(
  "/:id",
  authMiddleware,
  checkPermissions(["UPDATE_TASK", "EDIT_DEAL"]),
  updateTask
);
router.get("/deal/:dealId", authMiddleware, getTaskByDealId);
router.get("/date/due-date-range", authMiddleware, getTasksByDueDateRange);
router.delete(
  "/:id",
  checkPermissions(["DELETE_TASK", "EDIT_DEAL"]),
  authMiddleware,
  deleteTask
);
router.get("/filter/tasks", authMiddleware, filterTasks);
router.post(
  "/assign/user",
  authMiddleware,
  checkPermissions(["ASSIGN_TASK_TO_USER", "EDIT_DEAL"]),
  assignTaskToUser
);
router.put(
  "/change/status",
  authMiddleware,
  checkPermissions(["UPDATE_TASK", "EDIT_DEAL"]),
  changeTaskStatus
);
router.get("/user-tasks/tasks", authMiddleware, getTasksForUserDeals);

module.exports = router;
