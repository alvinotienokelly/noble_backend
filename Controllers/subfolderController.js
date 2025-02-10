// Controllers/subfolderController.js
const db = require("../Models");
const Subfolder = db.subfolders;
const User = db.users;
const Folder = db.folders;
const Document = db.documents;
const { createAuditLog } = require("./auditLogService");
const { Op } = require("sequelize");

// Create a new subfolder
const createSubfolder = async (req, res) => {
  try {
    const { name, created_for, parent_folder_id, parent_subfolder_id } =
      req.body;
    const created_by = req.user.id;

    // Check if the parent folder exists
    if (parent_folder_id) {
      const parentFolder = await Folder.findByPk(parent_folder_id);
      if (!parentFolder) {
        return res
          .status(200)
          .json({ status: false, message: "Parent folder not found." });
      }
    }

    // Check if the parent subfolder exists (if provided)
    if (parent_subfolder_id) {
      const parentSubfolder = await Subfolder.findByPk(parent_subfolder_id);
      if (!parentSubfolder) {
        return res
          .status(200)
          .json({ status: false, message: "Parent subfolder not found." });
      }
    }

    // Check if the user exists for created_for (if provided)
    if (created_for) {
      const user = await User.findByPk(created_for);
      if (!user) {
        return res
          .status(200)
          .json({ status: false, message: "User not found." });
      }
    }

    const subfolder = await Subfolder.create({
      name,
      created_by,
      created_for,
      parent_folder_id,
      parent_subfolder_id,
    });

    await createAuditLog({
      userId: created_by,
      action: "CREATE_SUBFOLDER",
      description: `Subfolder '${name}' created for user ID ${created_for}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, subfolder });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get a subfolder by ID
const getSubfolderById = async (req, res) => {
  try {
    const { id } = req.params;
    const subfolder = await Subfolder.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "createdFor", attributes: ["id", "name", "email"] },
        { model: Subfolder, as: "childSubfolders" },
        { model: Document, as: "subfolderDocuments" }, // Include documents
      ],
    });

    if (!subfolder) {
      return res
        .status(404)
        .json({ status: false, message: "Subfolder not found." });
    }
    await createAuditLog({
      userId: req.user.id,
      action: "GET_SUBFOLDER",
      description: `Subfolder with ID ${id} retrieved`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, subfolder });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all subfolders for a parent folder
const getSubfoldersByParentFolderId = async (req, res) => {
  try {
    const { parent_folder_id } = req.params;
    const subfolders = await Subfolder.findAll({
      where: { parent_folder_id },
      include: [
        { model: User, as: "creator" },
        { model: User, as: "createdFor" },
        // { model: Document, as: "subfolderDocuments" }, // Include documents
      ],
    });

    await createAuditLog({
      userId: req.user.id,
      action: "GET_SUBFOLDERS_BY_PARENT_FOLDER",
      description: `Subfolders for parent folder ID ${parent_folder_id} retrieved`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, subfolders });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a subfolder
const deleteSubfolder = async (req, res) => {
  try {
    const { id } = req.params;

    const subfolder = await Subfolder.findByPk(id);
    if (!subfolder) {
      return res
        .status(404)
        .json({ status: false, message: "Subfolder not found." });
    }

    await subfolder.destroy();

    res
      .status(200)
      .json({ status: true, message: "Subfolder deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a subfolder
const updateSubfolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, created_for, parent_folder_id, parent_subfolder_id } =
      req.body;

    const subfolder = await Subfolder.findByPk(id);
    if (!subfolder) {
      return res
        .status(404)
        .json({ status: false, message: "Subfolder not found." });
    }

    // Check if the parent folder exists
    if (parent_folder_id) {
      const parentFolder = await Folder.findByPk(parent_folder_id);
      if (!parentFolder) {
        return res
          .status(404)
          .json({ status: false, message: "Parent folder not found." });
      }
    }

    // Check if the parent subfolder exists (if provided)
    if (parent_subfolder_id) {
      const parentSubfolder = await Subfolder.findByPk(parent_subfolder_id);
      if (!parentSubfolder) {
        return res
          .status(404)
          .json({ status: false, message: "Parent subfolder not found." });
      }
    }

    // Check if the user exists for created_for (if provided)
    if (created_for) {
      const user = await User.findByPk(created_for);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }
    }

    await subfolder.update({
      name,
      created_for,
      parent_folder_id,
      parent_subfolder_id,
    });

    await createAuditLog({
      userId: req.user.id,
      action: "UPDATE_SUBFOLDER",
      description: `Subfolder with ID ${id} updated`,
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, subfolder });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Mark a subfolder as archived
const archiveSubfolder = async (req, res) => {
  try {
    const { id } = req.params;
    const subfolder = await Subfolder.findByPk(id);

    if (!subfolder) {
      return res
        .status(404)
        .json({ status: false, message: "Subfolder not found." });
    }

    subfolder.archived = true;
    await subfolder.save();

    await createAuditLog({
      userId: req.user.id,
      action: "ARCHIVE_SUBFOLDER",
      description: `Subfolder with ID ${id} archived`,
      ip_address: req.ip,
    });

    res
      .status(200)
      .json({ status: true, message: "Subfolder archived successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Filter subfolders based on various criteria
const filterSubfolders = async (req, res) => {
  try {
    const {
      name,
      created_by,
      created_for,
      parent_folder_id,
      parent_subfolder_id,
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

    if (parent_folder_id) {
      whereClause.parent_folder_id = parent_folder_id;
    }

    if (parent_subfolder_id) {
      whereClause.parent_subfolder_id = parent_subfolder_id;
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

    const { count: totalSubfolders, rows: subfolders } =
      await Subfolder.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: "creator", attributes: ["id", "name", "email"] },
          {
            model: User,
            as: "createdFor",
            attributes: ["id", "name", "email"],
          },
          {
            model: Folder,
            as: "parentFolder",
            attributes: ["folder_id", "name"],
          },
          {
            model: Subfolder,
            as: "parentSubfolder",
            attributes: ["subfolder_id", "name"],
          },
        ],
        offset,
        limit: parseInt(limit),
      });

    const totalPages = Math.ceil(totalSubfolders / limit);

    if (!subfolders || subfolders.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No subfolders found for the specified criteria.",
      });
    }

    res.status(200).json({
      status: true,
      totalSubfolders,
      totalPages,
      currentPage: parseInt(page),
      subfolders,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createSubfolder,
  getSubfolderById,
  getSubfoldersByParentFolderId,
  updateSubfolder,
  deleteSubfolder,
  archiveSubfolder,
  filterSubfolders,
};
