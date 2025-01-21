// Controllers/taskController.js
const db = require("../Models");
const Task = db.tasks;
const User = db.users;
const Deal = db.deals;
const { Op } = require("sequelize");
const { sendTaskReminder } = require("../Middlewares/emailService");
const { createNotification } = require("./notificationController");

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assigned_to,
      due_date,
      deal_id,
      deal_stage_id,
    } = req.body;
    const created_by = req.user.id;

    const task = await Task.create({
      title,
      description,
      assigned_to,
      created_by,
      due_date,
      deal_id,
      deal_stage_id,
    });

    res.status(200).json({ status: true, task });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalTasks, rows: tasks } = await Task.findAndCountAll({
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      status: true,
      totalTasks,
      totalPages,
      currentPage: parseInt(page),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
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
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalTasks, rows: tasks } = await Task.findAndCountAll({
      where: { assigned_to: req.params.userId },
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalTasks / limit);

    if (!tasks || tasks.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No tasks found for this user." });
    }

    res.status(200).json({
      status: true,
      totalTasks,
      totalPages,
      currentPage: parseInt(page),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get tasks by deal ID
const getTaskByDealId = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalTasks, rows: tasks } = await Task.findAndCountAll({
      where: { deal_id: req.params.dealId },
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalTasks / limit);

    if (!tasks || tasks.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "No tasks found for this deal." });
    }

    res.status(200).json({
      status: true,
      totalTasks,
      totalPages,
      currentPage: parseInt(page),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get tasks by date range
const getTasksByDueDateRange = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

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

    const { count: totalTasks, rows: tasks } = await Task.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalTasks / limit);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No tasks found for the specified date range.",
      });
    }

    res.status(200).json({
      status: true,
      totalTasks,
      totalPages,
      currentPage: parseInt(page),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Change task status
const changeTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res
        .status(200)
        .json({ status: false, message: "Task not found." });
    }

    await task.update({ status });
    res.status(200).json({ status: true, task });
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
      await createNotification(
        task.assignee.id,
        `Task Reminder: ${task.title}`,
        `The task "${task.title}" is due on ${task.due_date}.`
      );
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
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

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

    const { count: totalTasks, rows: tasks } = await Task.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalTasks / limit);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the specified criteria.",
      });
    }

    res.status(200).json({
      status: true,
      totalTasks,
      totalPages,
      currentPage: parseInt(page),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get tasks for deals that belong to the logged-in user
const getTasksForUserDeals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const deals = await Deal.findAll({ where: { target_company_id: userId } });
    const dealIds = deals.map((deal) => deal.deal_id);

    const { count: totalTasks, rows: tasks } = await Task.findAndCountAll({
      where: { deal_id: { [Op.in]: dealIds } },
      include: [
        { model: User, as: "assignee" },
        { model: User, as: "creator" },
        { model: Deal, as: "deal" },
      ],
      offset,
      limit: parseInt(limit),
    });

    const totalPages = Math.ceil(totalTasks / limit);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for your deals.",
      });
    }

    res.status(200).json({
      status: true,
      totalTasks,
      totalPages,
      currentPage: parseInt(page),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
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
  assignTaskToUser,
  changeTaskStatus,
  getTasksForUserDeals,
};
