const db = require("../Models");
const Folder = db.folders;
const User = db.users;
const Document = db.documents;
const Subfolder = db.subfolders;
const { createAuditLog } = require("./auditLogService");
const { Op } = require("sequelize");

const createFolder = async (req, res) => {
  try {
    const { name, created_for } = req.body;
    const created_by = req.user.id;

    // Check if the user exists for created_for
    if (created_for) {
      const user = await User.findByPk(created_for);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }
    }

    const folder = await Folder.create({
      name,
      created_by,
      created_for,
    });

    await createAuditLog({
      userId: created_by,
      action: "CREATE_FOLDER",
      description: `Folder '${name}' created for user ID ${created_for}`,
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, folder });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get a folder by ID
const getFolderById = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "createdFor", attributes: ["id", "name", "email"] },
        { model: Document, as: "folderDocuments" }, // Include documents
        {
          model: Subfolder,
          as: "subfolders",
          where: { parent_subfolder_id: null }, // Include subfolders whose parent_subfolder_id is null
          required: false, // Allow folders without subfolders
        },
      ],
    });

    if (!folder) {
      return res
        .status(404)
        .json({ status: false, message: "Folder not found." });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "GET_FOLDER",
      description: `Folder with ID ${id} retrieved`,
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, folder });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all folders
const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.findAll({
      include: [
        { model: User, as: "creator" },
        { model: User, as: "createdFor" },
      ],
    });
    await createAuditLog({
      userId: req.user.id,
      action: "GET_ALL_FOLDERS",
      description: "All folders retrieved",
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, folders });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getFoldersByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalFolders, rows: folders } = await Folder.findAndCountAll(
      {
        where: { created_by: userId },
        include: [{ model: User, as: "createdFor" }],
        offset,
        limit: parseInt(limit),
      }
    );

    const totalPages = Math.ceil(totalFolders / limit);

    await createAuditLog({
      userId: userId,
      action: "GET_FOLDERS_BY_USER",
      description: `Folders retrieved for user ID ${userId}`,
      ip_address: req.ip,
    });
    res.status(200).json({
      status: true,
      totalFolders,
      totalPages,
      currentPage: parseInt(page),
      folders,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Mark a folder as archived
const archiveFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findByPk(id);

    if (!folder) {
      return res
        .status(404)
        .json({ status: false, message: "Folder not found." });
    }

    folder.archived = true;
    await folder.save();

    await createAuditLog({
      userId: req.user.id,
      action: "ARCHIVE_FOLDER",
      description: `Folder with ID ${id} archived`,
      ip_address: req.ip,
    });

    res
      .status(200)
      .json({ status: true, message: "Folder archived successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Filter folders based on various criteria
const filterFolders = async (req, res) => {
  try {
    const {
      name,
      created_by,
      created_for,
      archived,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive search
    }

    if (created_by) {
      whereClause.created_by = created_by;
    }

    if (created_for) {
      whereClause.created_for = created_for;
    }

    if (archived !== undefined) {
      whereClause.archived = archived === "true";
    }

    if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      if (whereClause.createdAt) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      } else {
        whereClause.createdAt = { [Op.lte]: new Date(endDate) };
      }
    }

    const { count: totalFolders, rows: folders } = await Folder.findAndCountAll(
      {
        where: whereClause,
        include: [
          { model: User, as: "creator", attributes: ["id", "name", "email"] },
          {
            model: User,
            as: "createdFor",
            attributes: ["id", "name", "email"],
          },
        ],
        offset,
        limit: parseInt(limit),
      }
    );

    const totalPages = Math.ceil(totalFolders / limit);

    if (!folders || folders.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No folders found for the specified criteria.",
      });
    }

    res.status(200).json({
      status: true,
      totalFolders,
      totalPages,
      currentPage: parseInt(page),
      folders,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createFolder,
  getFoldersByUser,
  getAllFolders,
  getFolderById,
  archiveFolder,
  filterFolders, // Add this line
};
