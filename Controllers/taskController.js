// Controllers/taskController.js
const db = require("../Models");
const Task = db.tasks;
const User = db.users;
const Deal = db.deals;

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, assigned_to, due_date, deal_id } = req.body;
    const created_by = req.user.id;

    const task = await Task.create({
      title,
      description,
      assigned_to,
      created_by,
      due_date,
      deal_id,
    });

    res.status(200).json({ status: true, task });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
    });
    res.status(200).json({ status: true, tasks });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { task_id: req.params.id },
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
    });
    if (!task) {
      return res
        .status(200)
        .json({ status: false, message: "Task not found." });
    }
    res.status(200).json({ status: true, task });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res
        .status(200)
        .json({ status: false, message: "Task not found." });
    }
    await task.update(req.body);
    res.status(200).json({ status: true, task });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get tasks assigned to a specific user
const getTasksByUserId = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assigned_to: req.params.userId },
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
    });
    if (!tasks || tasks.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No tasks found for this user." });
    }
    res.status(200).json({ status: true, tasks });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get tasks by deal ID
const getTaskByDealId = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { deal_id: req.params.dealId },
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
    });
    if (!tasks || tasks.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No tasks found for this deal." });
    }
    res.status(200).json({ status: true, tasks });
  } catch (error) {
    res.status(200).json({ status: false, message: "nn" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res
        .status(200)
        .json({ status: false, message: "Task not found." });
    }
    await task.destroy();
    res
      .status(200)
      .json({ status: true, message: "Task deleted successfully." });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskByDealId,
  getTasksByUserId
};
