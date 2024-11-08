// Controllers/taskController.js
const db = require("../Models");
const Task = db.tasks;
const User = db.users;
const Deal = db.deals;
const { Op } = require("sequelize");
const { sendTaskReminder } = require("../Middlewares/emailService");

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

// Get tasks by date range
const getTasksByDueDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const whereClause = {};

    if (startDate) {
      whereClause.due_date = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      if (whereClause.due_date) {
        whereClause.due_date[Op.lte] = new Date(endDate);
      } else {
        whereClause.due_date = { [Op.lte]: new Date(endDate) };
      }
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
    });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No tasks found for the specified date range.",
      });
    }

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Assign task to user
const assignTaskToUser = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res
        .status(200)
        .json({ status: false, message: "Task not found." });
    }

    await task.update({ assigned_to: userId });
    res.status(200).json({ status: true, task });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Function to send task reminders
const sendTaskReminders = async () => {
  try {
    const tasks = await Task.findAll({
      where: {
        due_date: {
          [db.Sequelize.Op.lte]: new Date(
            new Date().getTime() + 24 * 60 * 60 * 1000
          ), // Tasks due within the next 24 hours
        },
        status: {
          [db.Sequelize.Op.ne]: "Completed",
        },
      },
      include: [{ model: User, as: "assignee" }],
    });

    for (const task of tasks) {
      await sendTaskReminder(task.assignee.email, task);
    }

    console.log("Task reminders sent successfully.");
  } catch (error) {
    console.error("Error sending task reminders:", error);
  }
};

// Filter tasks by various columns
const filterTasks = async (req, res) => {
  try {
    const {
      title,
      status,
      assigned_to,
      created_by,
      deal_id,
      startDate,
      endDate,
    } = req.query;
    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.iLike]: `%${title}%` }; // Case-insensitive search
    }

    if (status) {
      whereClause.status = status;
    }

    if (assigned_to) {
      whereClause.assigned_to = assigned_to;
    }

    if (created_by) {
      whereClause.created_by = created_by;
    }

    if (deal_id) {
      whereClause.deal_id = deal_id;
    }

    if (startDate) {
      whereClause.due_date = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      if (whereClause.due_date) {
        whereClause.due_date[Op.lte] = new Date(endDate);
      } else {
        whereClause.due_date = { [Op.lte]: new Date(endDate) };
      }
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
    });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the specified criteria.",
      });
    }

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
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
  getTasksByUserId,
  getTasksByDueDateRange,
  filterTasks,
  sendTaskReminders,
  assignTaskToUser
};
